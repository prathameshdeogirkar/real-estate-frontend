import { useState } from "react";
import axios from "axios";
import { X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ReviewModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/reviews", formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: "", rating: 5, message: "" });
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Write a Review</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={32} className="fill-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your review has been submitted and is pending approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 transition-transform hover:scale-110 focus:outline-none ${
                            star <= formData.rating ? "text-yellow-400" : "text-gray-200"
                          }`}
                        >
                          <Star size={32} className={star <= formData.rating ? "fill-current" : ""} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Message</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Share your experience with us..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ReviewModal;
