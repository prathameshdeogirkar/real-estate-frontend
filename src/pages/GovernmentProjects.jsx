import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { MapPin, Check, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import GovernmentProjectCard from "../components/GovernmentProjectCard";
import { ShieldCheck, Landmark, Droplets, Map } from "lucide-react";

function GovernmentProjects() {
  const [governmentProjects, setGovernmentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchGovernmentProjects();
  }, []);

  const fetchGovernmentProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/government-projects`);
      setGovernmentProjects(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredGovernmentProjects = selectedType === "All"
    ? governmentProjects
    : governmentProjects.filter((project) => {
        const searchStr = `${project.type} ${project.project_type} ${project.title} ${project.description}`.toLowerCase();
        return searchStr.includes(selectedType.toLowerCase());
      });

  if (loading) {
    return <Loader />;
  }

  const governmentProjectTypes = ["All", "Roads", "Public Buildings", "Water", "Infrastructure", "Civic Development"];

  const features = [
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Govt. Approved" },
    { icon: <Landmark className="w-5 h-5" />, title: "Public Infrastructure" },
    { icon: <Droplets className="w-5 h-5" />, title: "Water Supply" },
    { icon: <Map className="w-5 h-5" />, title: "Civic Development" }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <WhatsappButton />

      {/* HEADER SECTION */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577402985392-5eb32eaee6f9?q=80&w=2560&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/80 to-blue-900/50"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20 flex flex-col md:flex-row items-center justify-between">
          <div className="text-left md:w-3/5">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-blue-300 font-semibold tracking-[0.2em] uppercase text-sm mb-4 inline-flex items-center gap-2 border border-blue-400/30 bg-blue-900/40 px-4 py-1.5 rounded-sm">
              <Landmark className="w-4 h-4" /> Official Projects
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Empowering Public <br/> <span className="text-blue-400">Infrastructure</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-blue-100 font-light max-w-2xl mb-8">
              Dedicated to building robust and sustainable civic amenities. Browse our portfolio of approved government and public sector projects.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/90 text-sm font-medium bg-white/10 px-4 py-2 rounded">
                  <span className="text-blue-300">{feat.icon}</span>
                  {feat.title}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white border-b border-gray-200 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {governmentProjectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded font-medium transition-all duration-300 text-sm tracking-wide ${
                selectedType === type
                  ? "bg-blue-900 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* PROPERTIES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {filteredGovernmentProjects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-2xl text-gray-400 font-serif mb-2">No GovernmentProjects Found</p>
            <p className="text-gray-500 font-light">Try selecting a different government-project category.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredGovernmentProjects.map((governmentProject, idx) => (
              <GovernmentProjectCard key={governmentProject.id} governmentProject={governmentProject} idx={idx} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default GovernmentProjects;