import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { MapPin, Check, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import InteriorWorkCard from "../components/InteriorWorkCard";
import { Sparkles, Image as ImageIcon, PenTool, LayoutTemplate } from "lucide-react";

function InteriorWorks() {
  const [interiorWorks, setInteriorWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchInteriorWorks();
  }, []);

  const fetchInteriorWorks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/interior-works`);
      setInteriorWorks(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredInteriorWorks = selectedType === "All"
    ? interiorWorks
    : interiorWorks.filter((interiorWork) => {
        const searchStr = `${interiorWork.type} ${interiorWork.title} ${interiorWork.description}`.toLowerCase();
        return searchStr.includes(selectedType.toLowerCase());
      });

  if (loading) {
    return <Loader />;
  }

  const interiorWorkTypes = ["All", "Living Room", "Office", "Modular Kitchen", "Bedroom", "False Ceiling", "Furniture"];

  const services = [
    { icon: <LayoutTemplate className="w-6 h-6" />, title: "Space Planning" },
    { icon: <PenTool className="w-6 h-6" />, title: "Custom Design" },
    { icon: <Sparkles className="w-6 h-6" />, title: "Premium Finish" },
    { icon: <ImageIcon className="w-6 h-6" />, title: "3D Visualization" }
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
      <div className="relative w-full h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2560&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/20"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20 text-center flex flex-col items-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-stone-300 font-medium tracking-[0.3em] uppercase text-xs mb-6 border border-stone-400/50 px-6 py-2 rounded-full backdrop-blur-sm">
            Bespoke Interiors
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif text-stone-100 mb-6 font-light leading-tight">
            Elevating Your <br/> <span className="font-bold text-white">Living Spaces</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-stone-200 font-light max-w-2xl mx-auto mb-10">
            Discover a blend of elegance and functionality. We craft personalized interiors that reflect your true lifestyle.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 text-stone-200"
          >
            {services.map((svc, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm uppercase tracking-wider font-medium">
                <span className="text-stone-400">{svc.icon}</span>
                {svc.title}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-stone-50 border-b border-stone-200 py-8 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-stone-50/90">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {interiorWorkTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-500 text-sm tracking-wider ${
                selectedType === type
                  ? "bg-stone-800 text-stone-100 shadow-lg scale-105"
                  : "bg-transparent text-stone-500 border border-stone-300 hover:border-stone-800 hover:text-stone-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* PROPERTIES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {filteredInteriorWorks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-2xl text-gray-400 font-serif mb-2">No InteriorWorks Found</p>
            <p className="text-gray-500 font-light">Try selecting a different interior-work category.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredInteriorWorks.map((interiorWork, idx) => (
              <InteriorWorkCard key={interiorWork.id} interiorWork={interiorWork} idx={idx} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default InteriorWorks;