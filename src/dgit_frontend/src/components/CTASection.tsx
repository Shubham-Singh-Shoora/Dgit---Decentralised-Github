
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-background"></div>
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto glass p-8 md:p-16 rounded-2xl border border-purple-500/20">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-purple-900/50 flex items-center justify-center mb-8">
              <GitBranch size={32} className="text-cta" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 purple-glow">
              Ready to <span className="text-cta">Join the Revolution</span>?
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mb-8">
              Be among the first to experience the future of decentralized code hosting. 
              Sign up now for early access to Dgit and help shape the future of collaborative development.
            </p>
            
            <div className="w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-3 bg-background/70 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="btn-primary whitespace-nowrap">
                  Get Early Access
                </Button>
              </div>
              <p className="text-sm text-white/60 mt-3">
                Join 2,000+ developers already on the waitlist
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
