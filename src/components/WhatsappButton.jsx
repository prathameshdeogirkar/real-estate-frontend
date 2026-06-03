import { MessageCircle } from "lucide-react";

function WhatsappButton() {
  return (
    <a
      href="https://wa.me/917058816505"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.3)] z-50 transition-all duration-300 hover:-translate-y-2 group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
      <MessageCircle size={28} className="relative z-10 drop-shadow-md" />
    </a>
  );
}

export default WhatsappButton;