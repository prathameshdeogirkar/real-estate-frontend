import { Link } from "react-router-dom";
import { MapPin, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

function GovernmentProjectCard({ governmentProject, idx = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="group bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col"
    >
      <div className="relative h-56 overflow-hidden border-b border-gray-200">
        <ImageCarousel
          images={
            governmentProject.images
              ? typeof governmentProject.images === "string"
                ? JSON.parse(governmentProject.images)
                : governmentProject.images
              : [governmentProject.image]
          }
          alt={governmentProject.title}
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4 bg-blue-900 text-white px-3 py-1 rounded text-xs font-bold tracking-wider uppercase shadow-sm pointer-events-none">
          {governmentProject.type}
        </div>
        {governmentProject.offer_price && (
          <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded text-xs font-bold tracking-wider uppercase shadow-sm flex items-center gap-1 pointer-events-none">
            <ShieldCheck size={14} /> Approved
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs font-semibold uppercase">
          <MapPin size={14} className="text-blue-700" /> <span className="truncate">{governmentProject.address}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
          {governmentProject.title}
        </h3>

        <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-100 flex items-start gap-2">
           <FileText size={16} className="text-gray-400 mt-0.5" />
           <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
             Official public infrastructure initiative aimed at community development and sustainable growth.
           </p>
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
              Project Allocation
            </p>
            <p className="text-lg font-bold text-gray-900">
              {governmentProject.price ? `₹${((governmentProject.offer_price || governmentProject.price) / 100000).toFixed(2)} Cr` : "Tender Stage"}
            </p>
          </div>
          <Link
            to={`/government-projects/${governmentProject.id}`}
            className="flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            View Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default GovernmentProjectCard;
