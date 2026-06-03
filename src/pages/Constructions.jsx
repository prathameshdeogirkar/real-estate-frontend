import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { MapPin, Check, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import ConstructionCard from "../components/ConstructionCard";
import { Building2, HardHat, Trophy, Users } from "lucide-react";

function Constructions() {
  const [constructions, setConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchConstructions();
  }, []);

  const fetchConstructions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/constructions");
      setConstructions(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredConstructions = selectedType === "All"
    ? constructions
    : constructions.filter((construction) => {
        if (selectedType === "Ongoing" || selectedType === "Completed") {
          return construction.status === selectedType || construction.type === selectedType;
        }
        return construction.type === selectedType;
      });

  if (loading) {
    return <Loader />;
  }

  const constructionTypes = ["All", "Commercial", "Residential", "Ongoing", "Completed"];

  const stats = [
    { icon: <Trophy className="w-6 h-6" />, count: 15, suffix: "+", label: "Projects Delivered" },
    { icon: <HardHat className="w-6 h-6" />, count: 3.5, suffix: "+", label: "Years Experience" },
    { icon: <Users className="w-6 h-6" />, count: 27, suffix: "+", label: "Happy Clients" },
    { icon: <Building2 className="w-6 h-6" />, count: 5, suffix: "+", label: "Ongoing Sites" }
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
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2560&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20 flex flex-col md:flex-row items-center justify-between">
          <div className="text-left md:w-1/2">
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-sm mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-yellow-500"></span>
              Infrastructure & Construction
            </motion.span>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Building The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Future</span> Today
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-300 font-light max-w-xl">
              Delivering high-quality commercial and residential projects with unmatched precision and engineering excellence.
            </motion.p>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="relative z-20 -mt-16 max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border border-gray-100">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 font-serif">
                {stat.count}{stat.suffix}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-gray-50 border-b border-gray-100 py-8 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {constructionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2.5 rounded-none font-semibold transition-all duration-300 text-sm tracking-wide ${
                selectedType === type
                  ? "bg-gray-900 text-white border-b-2 border-yellow-500"
                  : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* PROPERTIES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {filteredConstructions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-2xl text-gray-400 font-serif mb-2">No Constructions Found</p>
            <p className="text-gray-500 font-light">Try selecting a different construction category.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredConstructions.map((construction, idx) => (
              <ConstructionCard key={construction.id} construction={construction} idx={idx} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Constructions;