import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ImageCarousel({ images, alt, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // If no images or invalid, just return null or placeholder
  if (!images || images.length === 0) return null;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openFullscreen = (e) => {
    e.stopPropagation();
    setIsFullscreen(true);
  };

  const closeFullscreen = () => setIsFullscreen(false);

  return (
    <>
      <div className={`relative group overflow-hidden ${className}`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={openFullscreen}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={closeFullscreen}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center p-4">
              <img
                src={images[currentIndex]}
                alt={`${alt} - Fullscreen`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                    className="absolute left-4 md:left-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                    className="absolute right-4 md:right-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[90vw] p-2 hide-scrollbar">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Thumbnail ${i}`}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`w-20 h-14 object-cover rounded cursor-pointer transition-all ${
                      i === currentIndex ? "border-2 border-primary scale-110" : "opacity-50 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ImageCarousel;
