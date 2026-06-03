import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function InquiryForm({ propertyId, propertyTitle }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    visitDate: "",
    message: `I'm interested in ${propertyTitle}. Please provide more details.`
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Please fill in required fields (Name, Phone, Message)");
      return;
    }

    setLoading(true);
    try {
      const finalMessage = `Requirement: ${formData.message}\nAddress: ${formData.address || 'N/A'}\nVisit Date: ${formData.visitDate || 'N/A'}`;

      await axios.post("http://localhost:5000/api/inquiries", {
        ...formData,
        message: finalMessage,
        property_id: propertyId
      });
      toast.success("Inquiry sent successfully!");
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        visitDate: "",
        message: ""
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mt-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Send Inquiry</h3>
        <p className="text-gray-500 font-light mb-6">Fill out the form below and our team will get back to you shortly.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp Number"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Target Address / Location</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Where do you want it?"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Available Date To Visit</label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Requirement / Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your requirements..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all text-sm resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} /> Send Inquiry Now
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-sm font-medium"
            >
              <CheckCircle size={18} />
              Inquiry sent successfully! We will contact you soon.
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium"
            >
              <AlertCircle size={18} />
              Something went wrong. Please try again.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InquiryForm;
