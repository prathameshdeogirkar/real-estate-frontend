import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function AddInteriorWork() {
  const [formData, setFormData] = useState({
    title: "",
    interior_type: "Home",
    description: "",
    location: "",
    room_type: "",
    design_style: "Modern",
    budget: "",
    duration: "",
    materials: "",
    furniture_included: "",
    lighting_details: "",
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
        const uploadRes = await axios.post("http://localhost:5000/api/upload", imageData, { headers: { Authorization: `Bearer ${token}` } });
        uploadedImageUrls = [uploadRes.data.imageUrl];
      } else {
        const imagesData = new FormData();
        images.forEach(img => imagesData.append("images", img));
        const uploadRes = await axios.post("http://localhost:5000/api/upload/multiple", imagesData, { headers: { Authorization: `Bearer ${token}` } });
        uploadedImageUrls = uploadRes.data.imageUrls;
      }

      const mainImage = uploadedImageUrls[0];
      
      const payload = {
        ...formData,
        image: mainImage,
        images: uploadedImageUrls,
        features: formData.features ? formData.features.split(',').map(s=>s.trim()) : [],
      };

      const res = await axios.post("http://localhost:5000/api/interior-works/add", payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message || "Interior Work Added Successfully!");
      
      setFormData({
        title: "",
    interior_type: "Home",
    description: "",
    location: "",
    room_type: "",
    design_style: "Modern",
    budget: "",
    duration: "",
    materials: "",
    furniture_included: "",
    lighting_details: "",
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Interior Work</h1>
        {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm"><p className="font-medium">{error}</p></div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interior Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interior Type</label>
              <select
                name="interior_type"
                value={formData.interior_type}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
              >
                <option value="Home">Home</option><option value="Office">Office</option><option value="Shop">Shop</option><option value="Villa">Villa</option><option value="Hotel">Hotel</option><option value="Commercial">Commercial</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <input
                type="text"
                name="room_type"
                value={formData.room_type}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Design Style</label>
              <select
                name="design_style"
                value={formData.design_style}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
              >
                <option value="Modern">Modern</option><option value="Traditional">Traditional</option><option value="Luxury">Luxury</option><option value="Minimal">Minimal</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Furniture Included</label>
              <input
                type="text"
                name="furniture_included"
                value={formData.furniture_included}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lighting Details</label>
              <input
                type="text"
                name="lighting_details"
                value={formData.lighting_details}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Interior (true/false)</label>
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
            {loading ? "Adding..." : "Add Interior Work"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default AddInteriorWork;