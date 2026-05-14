import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

function PropertyCard({ property, idx = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100"
    >
      <div className="relative h-64 overflow-hidden">
        <ImageCarousel
          images={
            property.images
              ? typeof property.images === "string"
                ? JSON.parse(property.images)
                : property.images
              : [property.image]
          }
          alt={property.title}
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm pointer-events-none">
          {property.type}
        </div>
        {property.offer_price && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm flex items-center gap-1 pointer-events-none">
            <Check size={14} /> Special Offer
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="flex items-center gap-2 text-gray-500 mb-3 text-sm font-medium">
          <MapPin size={16} className="text-primary" /> <span className="truncate">{property.address}</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 group-hover:text-primary transition-colors line-clamp-1">
          {property.title}
        </h3>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              {property.property_type === "For Rent" ? "Monthly Rent" : "Price"}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {property.property_type === "For Rent"
                ? `₹${property.rent_amount?.toLocaleString()}`
                : `₹${((property.offer_price || property.price) / 100000).toFixed(2)} Cr`}
            </p>
          </div>
          <Link
            to={`/property/${property.id}`}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;
