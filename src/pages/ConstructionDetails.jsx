import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, MessageCircle, ChevronLeft, Calendar, 
  Share2, Heart, Maximize2, Bed, Bath, Car, 
  CheckCircle2, Map, Share, ExternalLink, ArrowRight 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import ImageCarousel from "../components/ImageCarousel";
import ConstructionCard from "../components/ConstructionCard";
import InquiryForm from "../components/InquiryForm";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

function ConstructionDetails() {
  const { id } = useParams();
  const [construction, setConstruction] = useState(null);
  const [similarConstructions, setSimilarConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchConstruction();
  }, [id]);

  const fetchConstruction = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/constructions/${id}`);
      setConstruction(res.data);
      
      // Fetch similar constructions
      const allRes = await axios.get("http://localhost:5000/api/constructions");
      const filtered = allRes.data.filter(p => p.id !== parseInt(id) && p.type === res.data.type);
      setSimilarConstructions(filtered.slice(0, 3));
      
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: construction.title,
        text: `Check out this construction: ${construction.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="w-full h-[60vh] bg-gray-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!construction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 px-6 text-center">
        <h2 className="text-4xl font-serif text-gray-900 mb-4">Construction Not Found</h2>
        <p className="text-gray-500 mb-8">The listing you are looking for may have been removed or is currently unavailable.</p>
        <Link to="/constructions" className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:shadow-lg transition-all">
          Browse Portfolio
        </Link>
      </div>
    );
  }

  let parsedAmenities = [];
  if (construction.amenities) {
    try { parsedAmenities = typeof construction.amenities === 'string' ? JSON.parse(construction.amenities) : construction.amenities; } catch(e){}
  }
  
  let parsedNearby = [];
  if (construction.nearby_places) {
    try { parsedNearby = typeof construction.nearby_places === 'string' ? JSON.parse(construction.nearby_places) : construction.nearby_places; } catch(e){}
  }

  const allImages = construction.images 
    ? (typeof construction.images === 'string' ? JSON.parse(construction.images) : construction.images)
    : [construction.image];

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary selection:text-white pb-20">
      <Navbar />
      <WhatsappButton />

      {/* TOP HERO SECTION */}
      <div className="relative w-full h-[60vh] min-h-[500px] bg-dark pt-20 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <ImageCarousel 
            images={allImages} 
            alt={construction.title} 
            className="w-full h-full opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent pointer-events-none"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 pointer-events-none">
          <Link to="/constructions" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit mb-6 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 pointer-events-auto shadow-lg hover:bg-black/40">
            <ChevronLeft size={16} /> Return to Portfolio
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto">
            <div className="max-w-3xl">
              <div className="flex gap-3 mb-4">
                <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                  {construction.construction_type || 'For Sale'}
                </span>
                <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active
                </span>
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-2xl"
              >
                {construction.title}
              </motion.h1>
              <div className="flex items-center gap-2 text-white/90 text-xl font-medium drop-shadow-md">
                <MapPin size={24} className="text-primary" /> {construction.address}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all shadow-xl"
              >
                <Share2 size={24} />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-14 h-14 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isFavorite ? "bg-red-500 text-white border-red-500" : "bg-white/10 text-white hover:bg-red-500 hover:border-red-500"
                }`}
              >
                <Heart size={24} fill={isFavorite ? "white" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY CONTACT MOBILE (Visible only on mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-50 md:hidden flex gap-3">
        <a 
          href="tel:+917058816505"
          className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Phone size={20} /> Call
        </a>
        <a 
          href="https://wa.me/917058816505"
          className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> WhatsApp
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100"
            >
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-gray-100 mb-10">
                {construction.construction_type === "For Rent" ? (
                  <div className="flex flex-wrap gap-12">
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Monthly Rent</p>
                      <p className="text-4xl md:text-6xl font-serif font-bold text-gray-900">
                        ₹{construction.rent_amount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="border-l border-gray-100 pl-12">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Deposit</p>
                      <p className="text-4xl md:text-6xl font-serif font-bold text-gray-900">
                        ₹{construction.deposit_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Investment Opportunity</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl md:text-6xl font-serif font-bold text-gray-900">
                        ₹{((construction.offer_price || construction.price) / 100000).toFixed(2)}
                      </p>
                      <span className="text-3xl text-gray-400 font-serif">Cr</span>
                    </div>
                    {construction.offer_price && construction.price > construction.offer_price && (
                      <div className="mt-4 flex items-center gap-3">
                        <span className="line-through text-gray-400 text-lg">₹{(construction.price / 100000).toFixed(2)} Cr</span> 
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          Save ₹{((construction.price - construction.offer_price) / 100000).toFixed(2)} Cr
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* KEY DETAILS GRID */}
              {(construction.area || construction.bedrooms || construction.bathrooms || construction.parking) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {[
                    { icon: Maximize2, value: construction.area, label: "Sq Ft" },
                    { icon: Bed, value: construction.bedrooms, label: "Bedrooms" },
                    { icon: Bath, value: construction.bathrooms, label: "Bathrooms" },
                    { icon: Car, value: construction.parking, label: "Parking" }
                  ].map((feat, i) => feat.value && (
                    <div key={i} className="flex flex-col items-center p-6 bg-gray-50/50 rounded-3xl border border-gray-100 text-center hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all group">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                        <feat.icon size={28} strokeWidth={1.5} />
                      </div>
                      <p className="text-2xl font-serif font-bold text-gray-900">{feat.value}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">{feat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-16">
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-primary"></span>
                  Construction Narrative
                </h3>
                <p className="text-gray-600 text-xl leading-relaxed font-light whitespace-pre-line border-l-4 border-gray-50 pl-8">
                  {construction.description}
                </p>
              </div>

              {/* AMENITIES */}
              {parsedAmenities.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary"></span>
                    Exquisite Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {parsedAmenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-4 text-gray-700 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow group">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                          <CheckCircle2 size={20} />
                        </div>
                        <span className="font-semibold text-gray-900">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEARBY PLACES */}
              {parsedNearby.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary"></span>
                    Lifestyle & Vicinity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {parsedNearby.map((place, i) => (
                      <div key={i} className="flex items-center gap-5 text-gray-700 bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                          <MapPin size={20} className="text-primary" />
                        </div>
                        <span className="font-semibold text-lg text-gray-900">{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MAP */}
              {construction.map_location && (
                <div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary"></span>
                    Strategic Location
                  </h3>
                  <div className="w-full h-[500px] rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl">
                    {construction.map_location.includes('<iframe') ? (
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: construction.map_location.replace(/width="[^"]+"/, 'width="100%"').replace(/height="[^"]+"/, 'height="100%"') }} />
                    ) : (
                      <iframe 
                        src={construction.map_location} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </div>

          {/* RIGHT SIDEBAR (Sticky Contact) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-10 shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                    <Calendar size={32} />
                  </div>
                  
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">Inquire Privately</h3>
                  <p className="text-gray-500 font-light mb-10 text-lg">Arrange an exclusive viewing with our specialized real estate consultants.</p>

                  <div className="space-y-4">
                    <a
                      href="https://wa.me/917058816505"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-5 rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 shadow-xl shadow-green-200 hover:-translate-y-1"
                    >
                      <MessageCircle size={22} /> WhatsApp Specialist
                    </a>

                    <a
                      href="tel:+917058816505"
                      className="w-full inline-flex items-center justify-center gap-3 bg-dark text-white px-6 py-5 rounded-2xl font-bold hover:bg-black transition-all duration-300 shadow-xl shadow-gray-300 hover:-translate-y-1"
                    >
                      <Phone size={22} /> Instant Callback
                    </a>
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Aura+Agent&background=d4af37&color=fff" alt="Agent" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Construction Consultant</p>
                        <p className="text-xl font-bold text-gray-900">Vishwakarma Associates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SHARE QUICK BUTTON */}
              <button 
                onClick={handleShare}
                className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all mb-8"
              >
                <Share size={20} /> Share Construction
              </button>

              {/* INQUIRY FORM */}
              <InquiryForm constructionId={construction.id} constructionTitle={construction.title} />
            </div>
          </div>

        </div>

        {/* RELATED PROPERTIES */}
        {similarConstructions.length > 0 && (
          <div className="mt-24">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-primary"></span> Handpicked for You
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Similar Masterpieces</h2>
              </div>
              <Link to="/constructions" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mb-2">
                View All Portfolio <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarConstructions.map((p, idx) => (
                <ConstructionCard key={p.id} construction={p} idx={idx} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ConstructionDetails;
