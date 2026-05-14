import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Settings, MessageSquare, ClipboardList, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

function AdminDashboard() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchInquiryStats();
  }, []);

  const fetchInquiryStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/inquiries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const unread = res.data.filter(inq => !inq.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const menuItems = [
    { 
      title: "Add New Property", 
      path: "/admin/add-property", 
      icon: PlusCircle, 
      color: "bg-blue-500",
      desc: "Create a new luxury property listing"
    },
    { 
      title: "Manage Properties", 
      path: "/admin/manage-properties", 
      icon: ClipboardList, 
      color: "bg-purple-500",
      desc: "Edit or remove existing listings"
    },
    { 
      title: "Manage Inquiries", 
      path: "/admin/manage-inquiries", 
      icon: MessageSquare, 
      color: "bg-orange-500",
      desc: "View customer messages & leads",
      badge: unreadCount > 0 ? `${unreadCount} New` : null
    },
    { 
      title: "Completed Projects", 
      path: "/admin/manage-completed-projects", 
      icon: Settings, 
      color: "bg-green-500",
      desc: "Manage and remove your portfolio track record"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-4xl font-serif font-bold text-gray-900">Admin Command Center</h1>
            </div>
            <p className="text-gray-500">Welcome back. Manage your premium real estate empire.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={item.path}
                className="group block bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] rounded-bl-full -mr-8 -mt-8 group-hover:opacity-[0.08] transition-opacity`}></div>
                
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-serif font-bold text-gray-900">{item.title}</h2>
                      {item.badge && (
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                    
                    <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      Access Section <span>&rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;