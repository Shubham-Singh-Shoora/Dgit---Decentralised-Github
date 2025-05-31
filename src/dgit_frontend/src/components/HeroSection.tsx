
import { Button } from "@/components/ui/button";
import { GitBranch, Shield, LockOpen } from "lucide-react";
import { useRef, useEffect } from "react";

const HeroSection = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!iframeRef.current || !sectionRef.current) return;

      // Calculate cursor position relative to the section
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Send cursor position to iframe with more frequent updates
      try {
        iframeRef.current.contentWindow?.postMessage({
          type: 'cursor_position',
          x: x,
          y: y
        }, '*');
      } catch (error) {
        // Silently handle cross-origin restrictions
      }
    };

    const section = sectionRef.current;
    if (section) {
      // Use both mousemove and mouseover for better tracking
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseover', handleMouseMove);
      return () => {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseover', handleMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    // Multiple methods to hide Spline branding
    const hideSplineBranding = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Method 1: CSS injection
      const injectHidingCSS = () => {
        const style = document.createElement('style');
        style.id = 'spline-branding-hide';
        style.textContent = `
          /* Hide Spline branding in all possible ways */
          iframe[src*="spline.design"] {
            position: relative !important;
          }
          
          /* Target common Spline branding selectors */
          [class*="spline"], [class*="Spline"], 
          [id*="spline"], [id*="Spline"],
          a[href*="spline.design"],
          div[style*="spline"], span[style*="spline"],
          .watermark, .branding, .credits,
          [class*="watermark"], [class*="branding"], [class*="credits"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Hide bottom-right elements that might be branding */
          iframe[src*="spline.design"] ~ div,
          iframe[src*="spline.design"] + div {
            display: none !important;
          }
        `;
        
        // Remove existing style if present
        const existingStyle = document.getElementById('spline-branding-hide');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        document.head.appendChild(style);
      };

      // Method 2: Create multiple overlays to block branding
      const createBlockingOverlays = () => {
        const iframeContainer = iframe.parentElement;
        if (!iframeContainer) return;

        // Remove existing overlays
        const existingOverlays = iframeContainer.querySelectorAll('.spline-overlay');
        existingOverlays.forEach(overlay => overlay.remove());

        // Create overlays for common branding positions
        const positions = [
          { bottom: '0', right: '0', width: '200px', height: '60px' },
          { bottom: '10px', right: '10px', width: '180px', height: '40px' },
          { bottom: '0', right: '0', width: '100%', height: '80px' },
        ];

        positions.forEach((pos, index) => {
          const overlay = document.createElement('div');
          overlay.className = 'spline-overlay';
          overlay.style.position = 'absolute';
          overlay.style.bottom = pos.bottom;
          overlay.style.right = pos.right;
          overlay.style.width = pos.width;
          overlay.style.height = pos.height;
          overlay.style.background = 'transparent';
          overlay.style.zIndex = (1010 + index).toString();
          overlay.style.pointerEvents = 'none';
          iframeContainer.appendChild(overlay);
        });
      };

      // Apply methods immediately
      injectHidingCSS();
      createBlockingOverlays();

      // Apply methods after iframe loads
      iframe.onload = () => {
        setTimeout(() => {
          injectHidingCSS();
          createBlockingOverlays();
        }, 100);
        
        setTimeout(() => {
          injectHidingCSS();
          createBlockingOverlays();
        }, 1000);
        
        setTimeout(() => {
          injectHidingCSS();
          createBlockingOverlays();
        }, 3000);
      };
    };

    hideSplineBranding();
    
    // Reapply branding hiding periodically
    const interval = setInterval(hideSplineBranding, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* 3D Model Background - Only on tablet and larger screens */}
      <div className="absolute inset-0 hidden md:block" style={{ zIndex: 1 }}>
        <iframe 
          ref={iframeRef}
          src='https://my.spline.design/boxeshover-bf8IdvzQsixBOcyEF37yhUSD/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="pointer-events-auto"
          style={{ 
            filter: 'contrast(1.1) saturate(1.2)',
            border: 'none'
          }}
          title="3D Background Model"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Original background effects for smaller screens and as fallback */}
      <div className="absolute inset-0 bg-network-pattern opacity-30 md:hidden"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-background md:hidden"></div>
      
      {/* Purple glowing orbs - only on smaller screens */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl animate-pulse-slow md:hidden"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-800/20 blur-3xl animate-pulse-slow md:hidden"></div>
      
      {/* Content layer - now with pointer-events: none, except for interactive elements */}
      <div className="container mx-auto px-4 relative z-10 pointer-events-none">
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
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 pointer-events-auto">
              <Button className="btn-primary relative z-20">
                Get Early Access
              </Button>
              <Button variant="outline" className="btn-secondary relative z-20">
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
              <div className="glass p-6 relative" style={{ zIndex: 20 }}>
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
