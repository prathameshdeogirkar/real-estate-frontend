import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function AddGovernmentProject() {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    project_type: "",
    description: "",
    location: "",
    budget: "",
    start_date: "",
    completion_date: "",
    status: "Upcoming",
    contractor_name: "",
    contact_number: "",
    is_featured: "false"
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
    if (error) setError(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    if (error) setError(null);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || images.length === 0) {
      setError("Please fill in required fields and upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      let uploadedImageUrls = [];

      if (images.length === 1) {
        const imageData = new FormData();
        imageData.append("image", images[0]);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`, imageData, { headers: { Authorization: `Bearer ${token}` } });
        uploadedImageUrls = [uploadRes.data.imageUrl];
      } else {
        const imagesData = new FormData();
        images.forEach(img => imagesData.append("images", img));
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload/multiple`, imagesData, { headers: { Authorization: `Bearer ${token}` } });
        uploadedImageUrls = uploadRes.data.imageUrls;
      }

      const mainImage = uploadedImageUrls[0];
      
      const payload = {
        ...formData,
        image: mainImage,
        images: uploadedImageUrls,
        features: formData.features ? formData.features.split(',').map(s=>s.trim()) : [],
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/government-projects/add`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message || "Government Project Added Successfully!");
      
      setFormData({
        title: "",
    department: "",
    project_type: "",
    description: "",
    location: "",
    budget: "",
    start_date: "",
    completion_date: "",
    status: "Upcoming",
    contractor_name: "",
    contact_number: "",
    is_featured: "false"
      });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Government Project</h1>
        {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm"><p className="font-medium">{error}</p></div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Government Scheme/Project Type</label>
              <input
                type="text"
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
              <input
                type="text"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
              >
                <option value="Upcoming">Upcoming</option><option value="Ongoing">Ongoing</option><option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor/Agency Name</label>
              <input
                type="text"
                name="contractor_name"
                value={formData.contractor_name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Project (true/false)</label>
              <select
                name="is_featured"
                value={formData.is_featured}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
              >
                <option value="false">false</option><option value="true">true</option>
              </select>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Media</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images *</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white cursor-pointer" />
              {imagePreviews.length > 0 && (
                <div className="mt-4 flex gap-4 flex-wrap">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark shadow-lg"}`}>
            {loading ? "Adding..." : "Add Government Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default AddGovernmentProject;