
import { ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Push Your Code",
      description: "Push your code to Dgit, just like you would to any Git remote. Our familiar interface requires minimal changes to your workflow."
    },
    {
      number: "02",
      title: "Secure Distribution",
      description: "Your repository is securely stored and distributed across the Internet Computer Protocol network with advanced encryption."
    },
    {
      number: "03",
      title: "Collaboration",
      description: "Collaborate with confidence, knowing your code is truly decentralized, with full version control and access management."
    },
    {
      number: "04",
      title: "True Ownership",
      description: "Your code remains yours, resistant to censorship and platform changes, with immutable history preserved on the blockchain."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 purple-glow">
            How <span className="text-cta">Dgit</span> Works
          </h2>
          <p className="text-white/80 text-lg">
            Discover how Dgit transforms code hosting through the power of the Internet Computer Protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 right-0 w-full h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
              )}
              
              <div className="glass p-8 h-full relative animate-fade-in">
                <div className="text-5xl font-bold text-purple-500/30 absolute top-4 right-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-4 mt-4">
                  {step.title}
                </h3>
                <p className="text-white/70">
                  {step.description}
                </p>
              </div>
              
              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-4 mb-4">
                  <ArrowRight className="text-purple-500" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block glass py-4 px-8 max-w-2xl">
            <p className="text-white/80 italic">
              "Push, pull, and collaborate just like you've always done. The difference? Your code is now truly yours, secured by the power of ICP."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
