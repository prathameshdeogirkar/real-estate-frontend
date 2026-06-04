import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function EditConstruction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    project_type: "",
    description: "",
    location: "",
    area: "",
    budget: "",
    completion_time: "",
    status: "",
    contractor_name: "",
    materials: "",
    features: "",
    contact_number: "",
    is_featured: ""
  });
  
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/constructions/${id}`);
      const data = res.data;
      setFormData({
        ...data,
        features: Array.isArray(data.features) ? data.features.join(', ') : (data.features || ''),
      });
      setExistingImages(data.images || []);
    } catch (err) {
      setError("Failed to fetch data.");
    }
  };

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

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title?.trim() || (existingImages.length === 0 && images.length === 0)) {
      setError("Please fill in required fields and upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      let uploadedImageUrls = [...existingImages];

      if (images.length === 1) {
        const imageData = new FormData();
        imageData.append("image", images[0]);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`, imageData, { headers: { Authorization: `Bearer ${token}` } });
        uploadedImageUrls.push(uploadRes.data.imageUrl);
      } else if (images.length > 1) {
        const imagesData = new FormData();
        images.forEach(img => imagesData.append("images", img));
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload/multiple`, imagesData, { headers: { Authorization: `Bearer ${token}` } });
        uploadedImageUrls = [...uploadedImageUrls, ...uploadRes.data.imageUrls];
      }

      const mainImage = uploadedImageUrls[0];
      
      const payload = {
        ...formData,
        image: mainImage,
        images: uploadedImageUrls,
        features: formData.features ? formData.features.split(',').map(s=>s.trim()) : [],
      };

      const res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/constructions/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message || "Construction Updated Successfully!");
      navigate(`/admin/manage-constructions`);
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Construction</h1>
        {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm"><p className="font-medium">{error}</p></div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
              >
                <option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Road">Road</option><option value="Bridge">Bridge</option><option value="Building">Building</option><option value="Industrial">Industrial</option><option value="Other">Other</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area Size</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget / Cost</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Time</label>
              <input
                type="text"
                name="completion_time"
                value={formData.completion_time}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Name</label>
              <input
                type="text"
                name="contractor_name"
                value={formData.contractor_name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materials Used</label>
              <textarea
                name="materials"
                rows={4}
                value={formData.materials}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (Comma separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
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
            
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Existing Images</label>
                <div className="mt-4 flex gap-4 flex-wrap mb-4">
                  {existingImages.map((src, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add New Images</label>
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
            {loading ? "Updating..." : "Update Construction"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default EditConstruction;