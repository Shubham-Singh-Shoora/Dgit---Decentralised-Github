
import { Check, X } from "lucide-react";

const ProblemSolutionSection = () => {
  const problems = [
    "Centralized hosting creates a single point of failure",
    "Repositories can be taken down or censored",
    "Limited control over your own code",
    "Vulnerable to outages and service disruptions",
    "Subject to changing terms of service"
  ];

  const solutions = [
    "Fully decentralized architecture eliminates single points of failure",
    "Censorship-resistant by leveraging blockchain technology",
    "True ownership of your code through ICP technology",
    "Resilient network with global distribution",
    "Community-governed platform that puts developers first"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold purple-glow">
              Beyond Centralized <span className="text-cta">Limitations</span>
            </h2>
            
            <p className="text-lg text-white/80">
              Traditional code hosting platforms present numerous challenges and limitations for developers who value control, privacy, and true ownership.
            </p>
            
            <div className="space-y-3">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0">
                    <X className="text-red-500 h-5 w-5" />
                  </span>
                  <span className="text-white/80">{problem}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold purple-glow">
              The <span className="text-cta">Dgit</span> Solution
            </h2>
            
            <p className="text-lg text-white/80">
              Dgit leverages the Internet Computer Protocol to provide a truly decentralized alternative that puts developers back in control.
            </p>
            
            <div className="space-y-3">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0">
                    <Check className="text-green-500 h-5 w-5" />
                  </span>
                  <span className="text-white/80">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-purple-800/10 blur-3xl animate-pulse-slow"></div>
    </section>
  );
};

export default ProblemSolutionSection;
