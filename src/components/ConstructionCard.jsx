import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Check, HardHat, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

function ConstructionCard({ construction, idx = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="group bg-white rounded-none overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-t-4 border-yellow-500 flex flex-col"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <ImageCarousel
          images={
            construction.images
              ? typeof construction.images === "string"
                ? JSON.parse(construction.images)
                : construction.images
              : [construction.image]
          }
          alt={construction.title}
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4 bg-gray-900 text-yellow-500 px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm pointer-events-none flex items-center gap-2">
          <HardHat size={14} /> {construction.type}
        </div>
        {construction.offer_price && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 px-3 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm flex items-center gap-1 pointer-events-none">
            <Check size={14} /> Featured Project
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <MapPin size={14} className="text-yellow-600" /> <span className="truncate max-w-[150px]">{construction.address}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
            <Ruler size={14} /> {construction.area || "Custom"} Sq.Ft
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors line-clamp-2">
          {construction.title}
        </h3>

        {/* MOCK PROGRESS BAR */}
        <div className="mb-6 mt-auto">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
            <span>Project Status</span>
            <span className="text-yellow-600">{construction.type === 'Completed' ? '100%' : '75%'}</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className={`h-full bg-yellow-500 ${construction.type === 'Completed' ? 'w-full' : 'w-3/4'}`}></div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Project Value
            </p>
            <p className="text-lg font-bold text-gray-900">
              {construction.price ? `₹${((construction.offer_price || construction.price) / 100000).toFixed(2)} Cr` : "On Request"}
            </p>
          </div>
          <Link
            to={`/construction/${construction.id}`}
            className="w-10 h-10 bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-yellow-500 transition-all"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ConstructionCard;
