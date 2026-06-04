import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Phone, Mail, MessageSquare, ExternalLink, Clock, User, Check, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ManageInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch inquiries");
      toast.error("Failed to fetch inquiries");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.filter((inq) => inq.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Error deleting inquiry");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/inquiries/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/inquiries/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, is_read: true } : inq));
    } catch (err) {
      console.error(err);
      toast.error("Error marking as read");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading inquiries...</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-orange-100 text-orange-700';
      case 'Closed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Manage Inquiries</h1>
            <p className="text-gray-500 mt-2">View and manage customer inquiries from the website.</p>
          </div>
          <div className="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold">
            Total: {inquiries.length}
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {inquiries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-400 font-serif">No inquiries found yet.</p>
              </div>
            ) : (
              inquiries.map((inq, idx) => (
                <motion.div
                  key={inq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-3xl p-8 shadow-sm border ${inq.is_read ? 'border-gray-100' : 'border-primary/30 ring-1 ring-primary/10'} hover:shadow-md transition-shadow relative overflow-hidden group`}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${inq.is_read ? 'bg-gray-200' : 'bg-primary'} transition-colors`}></div>
                  
                  {!inq.is_read && (
                    <div className="absolute top-4 right-8">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-8 justify-between">
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-bold text-gray-700">
                          <User size={16} className="text-primary" /> {inq.name}
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(inq.status)}`}>
                          {inq.status}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={14} /> {new Date(inq.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Message</h4>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-2xl italic leading-relaxed">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inq.email && (
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-primary transition">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"><Mail size={14} /></div>
                            {inq.email}
                          </a>
                        )}
                        {inq.phone && (
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-primary transition">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"><Phone size={14} /></div>
                            {inq.phone}
                          </a>
                        )}
                        {inq.whatsapp && (
                          <a href={`https://wa.me/${inq.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-500 hover:text-green-600 transition">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-green-500"><MessageSquare size={14} /></div>
                            WhatsApp: {inq.whatsapp}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-72 space-y-4">
                      {inq.property_id && (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Interested Property</h4>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-gray-900 truncate">{inq.property_title}</p>
                            <a href={`/property/${inq.property_id}`} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark shrink-0">
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">Update Status</label>
                        <select 
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-primary transition-all"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        {!inq.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(inq.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold text-sm"
                          >
                            <Eye size={16} /> Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className={`${inq.is_read ? 'w-full' : 'w-12'} flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-sm`}
                          title="Delete Inquiry"
                        >
                          <Trash2 size={16} /> {inq.is_read && "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ManageInquiries;
