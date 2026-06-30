import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building, Shield, Star, Users, CheckCircle, Plus } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import ReviewModal from "../components/ReviewModal";
import TestimonialsSection from "../components/TestimonialsSection";

function Home() {
  const [properties, setProperties] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
    fetchCompletedProjects();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/properties`);
      setProperties(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchCompletedProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/completed-projects`);
      setCompletedProjects(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <WhatsappButton />

      {/* 1. HERO SECTION */}
      <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 motion-safe:animate-[pulse_20s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2560&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center mt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.span variants={fadeUp} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">
              Redefining Luxury Living
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-serif text-white font-bold leading-tight mb-6">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Perfect</span> Sanctuary
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-300 font-light mb-10 max-w-2xl">
              Delivering excellence in real estate, construction, government projects, and interior design with unmatched quality and trust.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 flex-wrap justify-center">
              <Link to="/properties" className="group relative px-8 py-4 bg-primary text-white overflow-hidden rounded-full font-medium transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                <span className="relative z-10 flex items-center gap-2">Explore Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
              <a href="https://wa.me/917058816505" className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all">
                Contact us
              </a>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all inline-flex items-center gap-2"
              >
                <Star size={16} className="fill-yellow-400 text-yellow-400" /> Write a Review
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-white/30 overflow-hidden">
            <div className="w-full h-1/2 bg-white animate-[bounce_2s_infinite]"></div>
          </div>
        </motion.div>
      </div>

      {/* 2. STATS SECTION (Floating) */}
      <div className="relative -mt-8 md:-mt-20 z-20 max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-20">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-12 border border-gray-100 grid grid-cols-2 md:flex flex-wrap justify-between items-center gap-4 md:gap-8 backdrop-blur-xl">
          {[
            { value: "3.5", label: "Years Experience", suffix: "+" },
            { value: "36", label: "Properties Sold", suffix: "+" },
            { value: "100", label: "Happy Clients", suffix: "%" },
            { value: "5", label: "Awards Won", suffix: "" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-1 md:mb-2 flex justify-center items-baseline">
                {stat.value}<span className="text-primary text-2xl md:text-3xl">{stat.suffix}</span>
              </div>
              <p className="text-gray-500 font-medium uppercase tracking-wider text-[10px] md:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ABOUT US SECTION */}
      <section className="py-8 md:py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-video lg:aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2560&auto=format&fit=crop" alt="Luxury Home Interior" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hidden md:block max-w-xs">
              <Star className="text-primary mb-4" size={32} />
              <p className="text-gray-900 font-serif text-xl italic mb-2">"Setting the gold standard in luxury real estate."</p>
              <p className="text-sm text-gray-500 font-semibold">— CEO, Vishwakarma Associates</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="w-full lg:w-1/2"
          >
            <motion.span variants={fadeUp} className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary"></span> Our Story
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Crafting Your Perfect Lifestyle Since 2022.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 mb-4 md:mb-6 text-base md:text-lg font-light leading-relaxed">
              We don't just sell properties; we curate lifestyles. For over a decade, Vishwakarma Associates has been the trusted partner for discerning clients seeking extraordinary homes and lucrative investment opportunities in prime locations.
            </motion.p>
            <motion.ul variants={fadeUp} className="space-y-3 mb-6 md:mb-10">
              {[
                "Exclusive access to off-market properties",
                "Personalized white-glove concierge service",
                "Expert negotiation and market analysis"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp}>
              <Link to="/properties" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors group">
                Read More About Us <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES (API) */}
      <section className="pt-8 pb-16 md:py-24 bg-gray-50 border-t border-gray-100 mt-4 md:mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-4 md:gap-6">
            <div className="max-w-2xl">
              <motion.span variants={fadeUp} className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block flex items-center gap-2">
                <span className="w-8 h-[1px] bg-primary"></span> Exclusive Listings
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Featured Properties</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/properties" className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-medium inline-flex items-center gap-2">
                View All <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {properties.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium text-lg">Loading exclusive properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((property, idx) => (
                <PropertyCard key={property.id} property={property} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section className="py-16 md:py-24 bg-dark text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span variants={fadeUp} className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Our Expertise</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold mb-6">Comprehensive Real Estate Services</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Building, title: "Property Sales", desc: "Expert guidance in buying and selling luxury properties with maximum return on investment." },
              { icon: Shield, title: "Asset Management", desc: "Complete property management services ensuring your investments are protected and profitable." },
              { icon: Users, title: "Consulting", desc: "Strategic advice tailored to your unique real estate portfolio and investment goals." }
            ].map((srv, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <srv.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{srv.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">{srv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPLETED PROJECTS (API) */}
      {completedProjects.length > 0 && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeUp} className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block justify-center flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary"></span> Track Record <span className="w-8 h-[1px] bg-primary"></span>
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Landmark Projects</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {completedProjects.slice(0, 4).map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[400px]"
              >
                <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">{project.year || "Completed"}</span>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2">{project.name}</h3>
                  <p className="text-gray-300 font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 7. TESTIMONIALS SECTION */}
      <TestimonialsSection onWriteReview={() => setReviewModalOpen(true)} />

      {/* 8. CTA SECTION */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
            Ready to Begin Your Real Estate Journey?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            Connect with our premium advisors today to find your dream property or list your current home.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/917058816505" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-dark text-white rounded-full font-bold hover:bg-black transition-colors shadow-xl inline-flex items-center justify-center gap-2">
              Chat on WhatsApp <ArrowRight size={18} />
            </a>
            <a href="tel:+917058816505" className="px-8 py-4 bg-transparent border border-white text-white rounded-full font-bold hover:bg-white hover:text-primary transition-colors inline-flex items-center justify-center gap-2">
              Call Advisor
            </a>
          </motion.div>
        </div>
      </section>

      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
      <Footer />
    </div>
  );
}

export default Home;
