
import { Button } from "@/components/ui/button";
import { GitBranch, Shield, LockOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-network-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-background"></div>
      
      {/* Purple glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-800/20 blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-secondary/30 backdrop-blur-sm border border-purple-500/20">
              <span className="animate-pulse h-2 w-2 rounded-full bg-purple-500"></span>
              <span className="text-sm font-medium text-purple-300">Powered by Internet Computer Protocol</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white purple-glow leading-tight">
              Your Code, <span className="text-cta">Decentralized.</span><br />
              The Future of Git.
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Experience secure, censorship-resistant code hosting with Dgit. Leveraging the Internet Computer for true code ownership and decentralized development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-primary">
                Get Early Access
              </Button>
              <Button variant="outline" className="btn-secondary">
                Learn More
              </Button>
            </div>
            
            <div className="pt-6">
              <p className="text-sm text-white/60">
                Trusted by <span className="font-semibold text-white">2,000+</span> early adopters
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 to-purple-500/20 blur-lg rounded-2xl"></div>
              <div className="glass p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch size={20} className="text-purple-400" />
                    <span className="font-semibold text-white">dgit:main</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-green-400" />
                    <LockOpen size={16} className="text-purple-400" />
                  </div>
                </div>
                <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto text-xs md:text-sm font-mono">
                  <code className="text-purple-300">
                    <span className="text-green-400">$ </span>dgit clone myproject<br />
                    <span className="text-purple-200">Cloning into 'myproject'...</span><br />
                    <span className="text-purple-200">Verifying ICP network connection...</span><br />
                    <span className="text-green-400">✓ </span><span className="text-purple-200">Connected to decentralized network</span><br />
                    <span className="text-green-400">✓ </span><span className="text-purple-200">Repository integrity verified</span><br />
                    <span className="text-green-400">✓ </span><span className="text-purple-200">Canister ID: adk29-dka21</span><br />
                    <span className="text-purple-200">Receiving objects: 100% (1823/1823)</span><br />
                    <span className="text-green-400">✓ </span><span className="text-purple-200">Decentralized repository ready</span><br />
                  </code>
                </pre>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-purple-300">Secured by ICP</div>
                  <div className="text-xs text-green-400">Decentralized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
