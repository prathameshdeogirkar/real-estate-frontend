import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { ErrorBanner, FormInput, FormTextarea, SubmitButton } from "../components/FormComponents";

function AddProperty() {
  const [formData, setFormData] = useState({
    title: "",
    type: "Flat",
    property_type: "For Sale",
    price: "",
    offer_price: "",
    rent_amount: "",
    deposit_amount: "",
    address: "",
    description: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    amenities: "",
    nearby_places: "",
    map_location: "",
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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

  const parseNumeric = (val) => {
    const trimmed = typeof val === "string" ? val.trim() : val;
    if (!trimmed) return null;
    const num = Number(trimmed);
    if (isNaN(num)) throw new Error("must be a valid number");
    return num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Required Fields Validation
    if (
      !formData.title.trim() ||
      !formData.type.trim() ||
      !formData.address.trim() ||
      !formData.description.trim() ||
      images.length === 0
    ) {
      setError("Please fill in all required fields and upload at least one image.");
      return;
    }

    const isForRent = (formData.type === "Flat" || formData.type === "Row House") && formData.property_type === "For Rent";
    const isForSale = !isForRent;

    if (isForSale && !formData.price.trim()) {
      setError("Sale Price is required for properties for sale.");
      return;
    }

    if (isForRent && (!formData.rent_amount.trim() || !formData.deposit_amount.trim())) {
      setError("Rent amount and Deposit amount are required for rent properties.");
      return;
    }

    // 2. Numeric Validation
    let priceNum, offerPriceNum, rentNum, depositNum, areaNum, bedsNum, bathsNum;
    try {
      if (isForSale) {
        priceNum = parseNumeric(formData.price);
        offerPriceNum = parseNumeric(formData.offer_price);
        if (priceNum === null) throw new Error("Price is required.");
      } else {
        rentNum = parseNumeric(formData.rent_amount);
        depositNum = parseNumeric(formData.deposit_amount);
        if (rentNum === null) throw new Error("Rent amount is required.");
        if (depositNum === null) throw new Error("Deposit amount is required.");
      }

      areaNum = parseNumeric(formData.area);
      bedsNum = parseNumeric(formData.bedrooms);
      bathsNum = parseNumeric(formData.bathrooms);
    } catch (err) {
      setError(`Validation Error: ${err.message}`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      let uploadedImageUrls = [];

      // Upload Images
      if (images.length === 1) {
        const imageData = new FormData();
        imageData.append("image", images[0]);
        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload",
          imageData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        uploadedImageUrls = [uploadRes.data.imageUrl];
      } else {
        const imagesData = new FormData();
        images.forEach(img => {
          imagesData.append("images", img);
        });
        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload/multiple",
          imagesData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        uploadedImageUrls = uploadRes.data.imageUrls;
      }

      const mainImage = uploadedImageUrls[0];

      // Parse comma separated lists
      const amenitiesList = formData.amenities.split(',').map(s => s.trim()).filter(s => s);
      const nearbyList = formData.nearby_places.split(',').map(s => s.trim()).filter(s => s);

      // Construct Final Payload
      const propertyData = {
        title: formData.title.trim(),
        type: formData.type.trim(),
        property_type: isForSale ? "For Sale" : "For Rent",
        price: isForSale ? priceNum : null,
        offer_price: isForSale ? offerPriceNum : null,
        rent_amount: isForRent ? rentNum : null,
        deposit_amount: isForRent ? depositNum : null,
        address: formData.address.trim(),
        description: formData.description.trim(),
        image: mainImage,
        images: uploadedImageUrls,
        area: areaNum,
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        parking: formData.parking.trim(),
        amenities: amenitiesList,
        nearby_places: nearbyList,
        map_location: formData.map_location.trim()
      };
      const res = await axios.post(
        "http://localhost:5000/api/properties/add",
        propertyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Property Added Successfully!");
      
      setFormData({
        title: "",
        type: "Flat",
        property_type: "For Sale",
        price: "",
        offer_price: "",
        rent_amount: "",
        deposit_amount: "",
        address: "",
        description: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        parking: "",
        amenities: "",
        nearby_places: "",
        map_location: "",
      });
      setImages([]);
      setImagePreviews([]);

    } catch (err) {
      console.error("API Error:", err);
      const backendError = err.response?.data?.message || "An unexpected error occurred while adding the property.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  const isRentable = formData.type === "Flat" || formData.type === "Row House";
  const isForRent = isRentable && formData.property_type === "For Rent";

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Add Property
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* BASIC INFO */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Basic Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Luxury Flat"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      type: e.target.value,
                      property_type: (e.target.value === "Plot") ? "For Sale" : formData.property_type
                    });
                    if (error) setError(null);
                  }}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                >
                  <option value="Flat">Flat</option>
                  <option value="Plot">Plot</option>
                  <option value="Row House">Row House</option>
                </select>
              </div>

              {isRentable && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Mode *</label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>
              )}
            </div>

            {!isForRent ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹) *</label>
                  <input
                    type="text"
                    name="price"
                    placeholder="e.g., 5000000"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹) (Optional)</label>
                  <input
                    type="text"
                    name="offer_price"
                    placeholder="e.g., 4500000"
                    value={formData.offer_price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹) *</label>
                  <input
                    type="text"
                    name="rent_amount"
                    placeholder="e.g., 15000"
                    value={formData.rent_amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (₹) *</label>
                  <input
                    type="text"
                    name="deposit_amount"
                    placeholder="e.g., 50000"
                    value={formData.deposit_amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PROPERTY FEATURES */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Property Features</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                <input
                  type="text"
                  name="area"
                  placeholder="e.g., 1200"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="text"
                  name="bedrooms"
                  placeholder="e.g., 3"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="text"
                  name="bathrooms"
                  placeholder="e.g., 2"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
                <input
                  type="text"
                  name="parking"
                  placeholder="e.g., 1 Covered"
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma separated)</label>
              <input
                type="text"
                name="amenities"
                placeholder="e.g., Swimming Pool, Gym, 24/7 Security"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Places (Comma separated)</label>
              <input
                type="text"
                name="nearby_places"
                placeholder="e.g., School (1km), Metro Station (500m)"
                value={formData.nearby_places}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>
          </div>

          {/* LOCATION & DESCRIPTION */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Location & Description</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                placeholder="e.g., 123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Map Iframe URL / Location Link</label>
              <input
                type="text"
                name="map_location"
                placeholder="Google Maps link or iframe src"
                value={formData.map_location}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the property..."
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition resize-none"
              />
            </div>
          </div>

          {/* IMAGES */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Media</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Images *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition bg-white cursor-pointer"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-4 flex gap-4 flex-wrap">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl hover:-translate-y-1"
            }`}
          >
            {loading ? "Adding Property..." : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;