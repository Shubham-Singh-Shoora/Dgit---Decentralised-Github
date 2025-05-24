import { Twitter, Github, Linkedin, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/30 pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading text-2xl font-bold purple-glow">Dgit</span>
            </div>
            <p className="text-white/60 mb-6">
              The next evolution in decentralized code hosting, powered by Internet Computer Protocol.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Github size={20} className="text-white/70" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter size={20} className="text-white/70" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <MessageSquare size={20} className="text-white/70" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Linkedin size={20} className="text-white/70" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-white/60 hover:text-cta transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-white/60 hover:text-cta transition-colors">How it Works</a></li>
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">Roadmap</a></li>
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">Documentation</a></li>
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">API</a></li>
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">ICP Integration</a></li>
              <li><a href="#faq" className="text-white/60 hover:text-cta transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/60 hover:text-cta transition-colors">Careers</a></li>
              <li><a href="#contact" className="text-white/60 hover:text-cta transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-white/10 mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} Dgit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
