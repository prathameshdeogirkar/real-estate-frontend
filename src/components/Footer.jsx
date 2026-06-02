import { Link } from "react-router-dom";
import { Building, Phone, MapPin, Mail, Facebook, Instagram, Linkedin, ArrowRight, Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-dark text-gray-300 relative overflow-hidden border-t border-white/10">
      
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          
          {/* BRAND SECTION */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/assets/logo.jpg" alt="Vishwakarma Associates" className="w-12 h-12 rounded-full object-cover shadow-lg border border-white/20" />
              <h2 className="text-xl font-bold font-serif text-white">
                Vishwakarma <span className="font-light block text-xs tracking-widest uppercase opacity-60">Associates</span>
              </h2>
            </div>
            <p className="text-gray-400 font-light leading-relaxed mb-8 text-sm">
              Setting the standard for luxury real estate. Discover properties that match your lifestyle and aspirations with our bespoke advisory services.
            </p>
            {/* SOCIAL LINKS */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com/vishwakarma_associates__" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition duration-300 text-sm font-medium inline-flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-primary" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-primary transition duration-300 text-sm font-medium inline-flex items-center gap-2 group">
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-primary" />
                  Exclusive Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-6">Contact</h3>
            <ul className="space-y-5 text-sm font-light">
              <li>
                <a href="tel:+917058816505" className="text-gray-400 hover:text-white transition duration-300 flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 text-primary" />
                  <span>+91 7058816505</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@vishwakarmaassociates.com" className="text-gray-400 hover:text-white transition duration-300 flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-primary" />
                  <span>info@vishwakarmaassociates.com</span>
                </a>
              </li>
              <li className="text-gray-400 flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-primary shrink-0" />
                <span>Maharashtra, India</span>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-6 text-sm font-light">
              Subscribe to receive updates on exclusive off-market properties and market reports.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-gray-700 pb-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <button className="absolute right-0 top-0 bottom-3 text-gray-500 hover:text-primary transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
          <p>&copy; {new Date().getFullYear()} Vishwakarma Associates. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;