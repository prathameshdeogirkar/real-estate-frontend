import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Star, Check, X, Edit3, Save, Clock, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", rating: 5, message: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting review");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      toast.success(`Review ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditData({ name: review.name, rating: review.rating, message: review.message });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", rating: 5, message: "" });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.map((r) => (r.id === id ? { ...r, ...editData } : r)));
      setEditingId(null);
      toast.success("Review updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating review");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const renderStars = (rating, interactive = false, onSet) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onSet(star)}
          className={`transition-transform ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={interactive ? 24 : 16}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
          />
        </button>
      ))}
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading reviews...</div>;

  const pendingCount = reviews.filter((r) => r.status === "Pending Approval").length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Manage Reviews</h1>
            <p className="text-gray-500 mt-2">Approve, edit, or remove customer reviews.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold">
              {pendingCount} Pending
            </span>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              {approvedCount} Approved
            </span>
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
              {reviews.length} Total
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {reviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-400 font-serif">No reviews submitted yet.</p>
              </div>
            ) : (
              reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-3xl p-8 shadow-sm border hover:shadow-md transition-shadow relative overflow-hidden
                    ${review.status === "Pending Approval" ? "border-yellow-200 ring-1 ring-yellow-100" : "border-gray-100"}`}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    review.status === "Approved" ? "bg-green-400" :
                    review.status === "Rejected" ? "bg-red-400" : "bg-yellow-400"
                  } transition-colors`} />

                  {editingId === review.id ? (
                    /* --- EDIT MODE --- */
                    <div className="space-y-4 pl-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Customer Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Rating</label>
                        {renderStars(editData.rating, true, (val) => setEditData({ ...editData, rating: val }))}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Review Message</label>
                        <textarea
                          value={editData.message}
                          onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveEdit(review.id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                        >
                          <Save size={16} /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                          <X size={16} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* --- VIEW MODE --- */
                    <div className="flex flex-col lg:flex-row gap-6 pl-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-bold text-gray-700">
                            <User size={15} className="text-primary" /> {review.name}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(review.status)}`}>
                            {review.status}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock size={13} /> {new Date(review.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div>{renderStars(review.rating)}</div>

                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Review</h4>
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-2xl italic leading-relaxed">
                            "{review.message}"
                          </p>
                        </div>
                      </div>

                      <div className="lg:w-56 flex flex-col gap-2">
                        {review.status !== "Approved" && (
                          <button
                            onClick={() => handleStatusChange(review.id, "Approved")}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-500 hover:text-white transition-all font-bold text-sm"
                          >
                            <Check size={16} /> Approve
                          </button>
                        )}
                        {review.status !== "Rejected" && (
                          <button
                            onClick={() => handleStatusChange(review.id, "Rejected")}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                          >
                            <X size={16} /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(review)}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold text-sm"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ManageReviews;
