
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch size={28} className="text-cta" />
          <span className="font-heading text-2xl font-bold purple-glow">Dgit</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
            Testimonials
          </a>
          <a href="#faq" className="text-white/80 hover:text-white transition-colors">
            FAQ
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:inline-flex" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button className="btn-primary">
            Get Early Access
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
