import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Building, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const navBg = scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : isHome ? "bg-transparent" : "bg-white shadow-sm";
  const textColor = scrolled || !isHome ? "text-gray-900" : "text-white";
  const logoColor = scrolled || !isHome ? "text-primary" : "text-primary";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg} border-b ${scrolled ? 'border-gray-200/50' : 'border-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-12 py-4 md:py-5">
        
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/assets/logo.jpg" alt="Vishwakarma Associates" className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-primary" />
          <h1 className={`text-xl font-bold font-serif ${scrolled || !isHome ? 'text-gray-900' : 'text-white'}`}>
            Vishwakarma <span className="font-light block text-xs tracking-[0.3em] uppercase opacity-70">Associates</span>
          </h1>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium tracking-wide uppercase ${textColor} hover:text-primary transition duration-300`}>Home</Link>
          <Link to="/properties" className={`text-sm font-medium tracking-wide uppercase ${textColor} hover:text-primary transition duration-300`}>Properties</Link>
          <Link to="/construction" className={`text-sm font-medium tracking-wide uppercase ${textColor} hover:text-primary transition duration-300`}>Construction</Link>
          <Link to="/interior-work" className={`text-sm font-medium tracking-wide uppercase ${textColor} hover:text-primary transition duration-300`}>Interior</Link>
          <Link to="/government-projects" className={`text-sm font-medium tracking-wide uppercase ${textColor} hover:text-primary transition duration-300`}>Government</Link>
          
          <a href="https://instagram.com/vishwakarma_associates__" target="_blank" rel="noopener noreferrer" className={`${textColor} hover:text-primary transition duration-300`}>
            <Instagram size={20} />
          </a>

          <a
            href="https://wa.me/917058816505"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              scrolled || !isHome 
                ? 'bg-primary text-white shadow-md hover:bg-primary-dark hover:shadow-lg' 
                : 'bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-gray-900'
            }`}
          >
            <Phone size={16} />
            Contact Us
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className={`md:hidden p-2 rounded-full transition duration-300 ${textColor} hover:bg-black/5`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white px-6 pb-6 pt-2 flex flex-col gap-4 border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-900 text-lg font-medium py-2 hover:text-primary transition">Home</Link>
            <Link to="/properties" onClick={() => setMenuOpen(false)} className="text-gray-900 text-lg font-medium py-2 hover:text-primary transition">Properties</Link>
            <Link to="/construction" onClick={() => setMenuOpen(false)} className="text-gray-900 text-lg font-medium py-2 hover:text-primary transition">Construction</Link>
            <Link to="/interior-work" onClick={() => setMenuOpen(false)} className="text-gray-900 text-lg font-medium py-2 hover:text-primary transition">Interior Work</Link>
            <Link to="/government-projects" onClick={() => setMenuOpen(false)} className="text-gray-900 text-lg font-medium py-2 hover:text-primary transition">Government Projects</Link>
            <a href="https://instagram.com/vishwakarma_associates__" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-900 text-lg font-medium py-2 hover:text-primary transition">
              <Instagram size={20} /> Instagram
            </a>
            <a
              href="https://wa.me/917058816505"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-full px-6 py-3 mt-2 font-medium transition shadow-md"
            >
              <Phone size={18} /> Contact Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;