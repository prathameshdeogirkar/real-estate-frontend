import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ErrorBanner, FormInput, FormTextarea, SubmitButton } from "../components/FormComponents";
import { parseNumeric, checkRequiredFields } from "../utils/validation";
import { X } from "lucide-react";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/properties/${id}`
      );
      
      const propData = res.data;
      
      let parsedImages = [];
      if (propData.images) {
        try {
          parsedImages = typeof propData.images === 'string' ? JSON.parse(propData.images) : propData.images;
        } catch(e) {
          console.error("Error parsing images", e);
        }
      } else if (propData.image) {
        parsedImages = [propData.image];
      }

      let parsedAmenities = propData.amenities;
      if (typeof parsedAmenities === 'string') {
        try { parsedAmenities = JSON.parse(parsedAmenities); } catch(e) {}
      }
      
      let parsedNearby = propData.nearby_places;
      if (typeof parsedNearby === 'string') {
        try { parsedNearby = JSON.parse(parsedNearby); } catch(e) {}
      }

      setFormData({
        ...propData,
        images: parsedImages,
        amenities: Array.isArray(parsedAmenities) ? parsedAmenities.join(', ') : (parsedAmenities || ""),
        nearby_places: Array.isArray(parsedNearby) ? parsedNearby.join(', ') : (parsedNearby || ""),
        area: propData.area || "",
        bedrooms: propData.bedrooms || "",
        bathrooms: propData.bathrooms || "",
        parking: propData.parking || "",
        map_location: propData.map_location || ""
      });
      setExistingImages(parsedImages || []);
      
    } catch (err) {
      setError("Failed to fetch property details");
    } finally {
      setFetching(false);
    }
  };

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

    setNewImages(prev => [...prev, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
    if (error) setError(null);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      checkRequiredFields([
        formData.title,
        formData.type,
        formData.address,
        formData.description,
      ], "Please fill in all required fields.");

      if (existingImages.length === 0 && newImages.length === 0) {
        throw new Error("Please upload at least one image.");
      }

      const isForRent = (formData.type === "Flat" || formData.type === "Row House") && formData.property_type === "For Rent";
      const isForSale = !isForRent;

      if (isForSale && (!formData.price || formData.price === "")) {
        throw new Error("Sale Price is required for properties for sale.");
      }
  
      if (isForRent && ((!formData.rent_amount || formData.rent_amount === "") || (!formData.deposit_amount || formData.deposit_amount === ""))) {
        throw new Error("Rent amount and Deposit amount are required for rent properties.");
      }

      let priceNum = null, offerPriceNum = null, rentNum = null, depositNum = null, areaNum = null, bedsNum = null, bathsNum = null;
      
      if (isForSale) {
        priceNum = parseNumeric(formData.price, "Price");
        offerPriceNum = parseNumeric(formData.offer_price, "Offer Price");
      } else {
        rentNum = parseNumeric(formData.rent_amount, "Rent Amount");
        depositNum = parseNumeric(formData.deposit_amount, "Deposit Amount");
      }

      areaNum = parseNumeric(formData.area, "Area");
      bedsNum = parseNumeric(formData.bedrooms, "Bedrooms");
      bathsNum = parseNumeric(formData.bathrooms, "Bathrooms");

      setLoading(true);

      const token = localStorage.getItem("adminToken");
      let uploadedImageUrls = [...existingImages];

      if (newImages.length > 0) {
        const imagesData = new FormData();
        newImages.forEach(img => {
          imagesData.append("images", img);
        });
        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload/multiple`,
          imagesData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        uploadedImageUrls = [...uploadedImageUrls, ...uploadRes.data.imageUrls];
      }

      const mainImage = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : "";

      const amenitiesList = formData.amenities ? formData.amenities.split(',').map(s => s.trim()).filter(s => s) : [];
      const nearbyList = formData.nearby_places ? formData.nearby_places.split(',').map(s => s.trim()).filter(s => s) : [];

      const propertyData = {
        ...formData,
        property_type: isForSale ? "For Sale" : "For Rent",
        price: isForSale ? priceNum : null,
        offer_price: isForSale ? offerPriceNum : null,
        rent_amount: isForRent ? rentNum : null,
        deposit_amount: isForRent ? depositNum : null,
        image: mainImage,
        images: uploadedImageUrls,
        area: areaNum,
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        parking: formData.parking ? formData.parking.trim() : null,
        amenities: amenitiesList,
        nearby_places: nearbyList,
        map_location: formData.map_location ? formData.map_location.trim() : null
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/properties/${id}`,
        propertyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Property Updated Successfully!");
      navigate("/admin/manage-properties");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Error updating property");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center">Loading Property...</div>;

  const isRentable = formData.type === "Flat" || formData.type === "Row House";
  const isForRent = isRentable && formData.property_type === "For Rent";

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Property</h1>

        <ErrorBanner error={error} />

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* BASIC INFO */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Basic Details</h3>
            
            <FormInput
              label="Title *"
              name="title"
              placeholder="e.g., Luxury Flat"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Category *</label>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition duration-200 bg-white"
                  required
                >
                  <option value="Flat">Flat</option>
                  <option value="Plot">Plot</option>
                  <option value="Row House">Row House</option>
                </select>
              </div>

              {isRentable && (
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Property Mode *</label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition duration-200 bg-white"
                    required
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>
              )}
            </div>

            {!isForRent ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Sale Price (₹) *"
                  name="price"
                  placeholder="e.g., 5000000"
                  value={formData.price || ""}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Offer Price (₹) (Optional)"
                  name="offer_price"
                  placeholder="e.g., 4500000"
                  value={formData.offer_price || ""}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Monthly Rent (₹) *"
                  name="rent_amount"
                  placeholder="e.g., 15000"
                  value={formData.rent_amount || ""}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Deposit Amount (₹) *"
                  name="deposit_amount"
                  placeholder="e.g., 50000"
                  value={formData.deposit_amount || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          {/* PROPERTY FEATURES */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Property Features</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <FormInput
                label="Area (sq ft)"
                name="area"
                placeholder="e.g., 1200"
                value={formData.area || ""}
                onChange={handleChange}
              />
              <FormInput
                label="Bedrooms"
                name="bedrooms"
                placeholder="e.g., 3"
                value={formData.bedrooms || ""}
                onChange={handleChange}
              />
              <FormInput
                label="Bathrooms"
                name="bathrooms"
                placeholder="e.g., 2"
                value={formData.bathrooms || ""}
                onChange={handleChange}
              />
              <FormInput
                label="Parking"
                name="parking"
                placeholder="e.g., 1 Covered"
                value={formData.parking || ""}
                onChange={handleChange}
              />
            </div>

            <FormInput
              label="Amenities (Comma separated)"
              name="amenities"
              placeholder="e.g., Swimming Pool, Gym, 24/7 Security"
              value={formData.amenities || ""}
              onChange={handleChange}
            />

            <FormInput
              label="Nearby Places (Comma separated)"
              name="nearby_places"
              placeholder="e.g., School (1km), Metro Station (500m)"
              value={formData.nearby_places || ""}
              onChange={handleChange}
            />
          </div>

          {/* LOCATION & DESCRIPTION */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Location & Description</h3>

            <FormInput
              label="Address *"
              name="address"
              placeholder="e.g., 123 Main St, City"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Map Iframe URL / Location Link"
              name="map_location"
              placeholder="Google Maps link or iframe src"
              value={formData.map_location || ""}
              onChange={handleChange}
            />

            <FormTextarea
              label="Description *"
              name="description"
              placeholder="Describe the property..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* MEDIA */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Media</h3>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Property Images *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition duration-200 bg-white cursor-pointer"
              />
              
              <div className="mt-4 flex gap-4 flex-wrap">
                {existingImages.map((src, index) => (
                  <div key={`existing-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={src} alt="Existing" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {newImagePreviews.map((src, index) => (
                  <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 opacity-80">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SubmitButton
            loading={loading}
            loadingText="Updating Property..."
            defaultText="Update Property"
          />
        </form>
      </div>
    </div>
  );
}

export default EditProperty;