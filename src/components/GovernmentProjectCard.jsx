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
      <div className="relative h-40 md:h-56 overflow-hidden border-b border-gray-200">
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
        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-900 text-white px-2 py-0.5 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-sm pointer-events-none">
          {governmentProject.type}
        </div>
        {governmentProject.offer_price && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-green-700 text-white px-2 py-0.5 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-sm flex items-center gap-1 pointer-events-none">
            <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" /> Approved
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 md:gap-2 text-gray-500 mb-1.5 md:mb-2 text-[10px] md:text-xs font-semibold uppercase">
          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-700" /> <span className="truncate">{governmentProject.address}</span>
        </div>
        <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
          {governmentProject.title}
        </h3>

        <div className="mb-3 md:mb-4 bg-gray-50 p-2 md:p-3 rounded border border-gray-100 flex items-start gap-1.5 md:gap-2">
           <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5" />
           <p className="text-[10px] md:text-xs text-gray-600 line-clamp-2 leading-relaxed">
             Official public infrastructure initiative aimed at community development and sustainable growth.
           </p>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 md:pt-4 border-t border-gray-200">
          <div>
            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 md:mb-1">
              Project Allocation
            </p>
            <p className="text-sm md:text-lg font-bold text-gray-900">
              {governmentProject.price ? `₹${((governmentProject.offer_price || governmentProject.price) / 100000).toFixed(2)} Cr` : "Tender Stage"}
            </p>
          </div>
          <Link
            to={`/government-projects/${governmentProject.id}`}
            className="flex items-center gap-1 text-xs md:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            View Details <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default GovernmentProjectCard;
