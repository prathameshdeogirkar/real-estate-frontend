import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Sparkles, Palette } from "lucide-react";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

function InteriorWorkCard({ interiorWork, idx = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="group bg-stone-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200"
    >
      <div className="relative h-72 overflow-hidden p-2 pb-0">
        <div className="w-full h-full rounded-t-md overflow-hidden relative">
        <ImageCarousel
          images={
            interiorWork.images
              ? typeof interiorWork.images === "string"
                ? JSON.parse(interiorWork.images)
                : interiorWork.images
              : [interiorWork.image]
          }
          alt={interiorWork.title}
          className="w-full h-full"
        />
        </div>
        <div className="absolute top-6 right-6 bg-stone-900/80 backdrop-blur-md text-stone-100 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase shadow-sm pointer-events-none border border-stone-700/50">
          {interiorWork.type}
        </div>
        {interiorWork.offer_price && (
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase shadow-sm flex items-center gap-1 pointer-events-none">
            <Sparkles size={14} className="text-yellow-600" /> Premium Design
          </div>
        )}
      </div>

      <div className="p-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-stone-500 mb-4 text-xs font-medium tracking-widest uppercase">
          <MapPin size={14} /> <span className="truncate">{interiorWork.address}</span>
        </div>
        <h3 className="text-2xl font-serif text-stone-800 mb-4 group-hover:text-stone-500 transition-colors line-clamp-1">
          {interiorWork.title}
        </h3>

        <div className="flex justify-between items-center w-full pt-6 border-t border-stone-200 mt-2">
          <div className="text-left">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">
              Estimated Budget
            </p>
            <p className="text-lg font-serif text-stone-800">
              {interiorWork.price ? `₹${((interiorWork.offer_price || interiorWork.price) / 100000).toFixed(2)} Cr` : "Upon Consultation"}
            </p>
          </div>
          <Link
            to={`/interior-work/${interiorWork.id}`}
            className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 group-hover:bg-stone-800 group-hover:border-stone-800 group-hover:text-white transition-all duration-300"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default InteriorWorkCard;
