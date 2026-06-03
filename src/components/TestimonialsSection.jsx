import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TestimonialsSection({ onWriteReview }) {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reviews/approved")
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (reviews.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [reviews]);

  const prev = () => {
    clearInterval(intervalRef.current);
    setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  };

  const next = () => {
    clearInterval(intervalRef.current);
    setCurrent((c) => (c + 1) % reviews.length);
  };

  const renderStars = (rating) => (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={20}
          className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}
        />
      ))}
    </div>
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            Client Testimonials
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            What Our Clients Say
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 font-light max-w-xl mx-auto">
            Real experiences from real clients who found their perfect space with Vishwakarma Associates.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          /* No reviews yet — show write-a-review CTA */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12 bg-white/5 rounded-3xl border border-white/10"
          >
            <Quote size={40} className="text-primary mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg mb-6">Be the first to share your experience!</p>
            <button
              onClick={onWriteReview}
              className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              Write the First Review
            </button>
          </motion.div>
        ) : (
          <>
            {/* Carousel */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 md:p-14 text-center max-w-3xl mx-auto"
                >
                  <Quote size={40} className="text-primary mx-auto mb-6 opacity-60" />
                  <p className="text-xl md:text-2xl text-gray-200 font-light italic leading-relaxed mb-8">
                    "{reviews[current].message}"
                  </p>
                  <div className="mb-4">{renderStars(reviews[current].rating)}</div>
                  <p className="text-white font-bold text-lg font-serif">{reviews[current].name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(reviews[current].created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Nav Arrows */}
              {reviews.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white/10 hover:bg-primary text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10"
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white/10 hover:bg-primary text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10"
                    aria-label="Next review"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {reviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { clearInterval(intervalRef.current); setCurrent(i); }}
                    className={`rounded-full transition-all ${i === current ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"}`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Write a Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12"
        >
          <button
            id="write-review-btn"
            onClick={onWriteReview}
            className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:scale-105 inline-flex items-center gap-2"
          >
            <Star size={18} className="fill-white" />
            Write a Review
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
