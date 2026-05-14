import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { ErrorBanner, FormInput, FormTextarea, SubmitButton } from "../components/FormComponents";
import { checkRequiredFields } from "../utils/validation";

function AddCompletedProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      checkRequiredFields([
        formData.title,
        formData.description,
        formData.year,
        formData.image,
      ], "Please fill in all required fields and upload an image.");

      setLoading(true);

      const imageData = new FormData();
      imageData.append("image", formData.image);

      const token = localStorage.getItem("adminToken");
      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload",
        imageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const imageUrl = uploadRes.data.imageUrl;

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        year: formData.year.trim(),
        image: imageUrl,
      };

      const res = await axios.post(
        "http://localhost:5000/api/completed-projects/add",
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Project Added Successfully!");
      
      setFormData({
        title: "",
        description: "",
        year: "",
        image: null,
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Error adding project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/admin/manage-completed-projects" 
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Completed Project</h1>

        <ErrorBanner error={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Project Title"
            name="title"
            placeholder="e.g., Skyline Apartments"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Completion Year"
            name="year"
            placeholder="e.g., 2023"
            value={formData.year}
            onChange={handleChange}
            required
          />

          <FormTextarea
            label="Description"
            name="description"
            placeholder="Describe the completed project..."
            value={formData.description}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Project Image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <SubmitButton
            loading={loading}
            loadingText="Adding Project..."
            defaultText="Add Project"
          />
        </form>
        </div>
      </div>
    </div>
  );
}

export default AddCompletedProject;