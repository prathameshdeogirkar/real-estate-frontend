import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { MapPin, Check, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import PropertyCard from "../components/PropertyCard";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/properties`);
      setProperties(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredProperties = selectedType === "All"
    ? properties
    : properties.filter((property) => property.type === selectedType);

  if (loading) {
    return <Loader />;
  }

  const propertyTypes = ["All", "Flat", "Plot", "Row House"];

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
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2560&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">
            Portfolio
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Exclusive Listings
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            Explore our meticulously curated selection of premium properties.
          </motion.p>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-gray-50 border-b border-gray-100 py-8 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm tracking-wide ${
                selectedType === type
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* PROPERTIES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {filteredProperties.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-2xl text-gray-400 font-serif mb-2">No Properties Found</p>
            <p className="text-gray-500 font-light">Try selecting a different property category.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} idx={idx} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Properties;