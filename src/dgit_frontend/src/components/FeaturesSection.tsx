
import { Network, Shield, GitBranch, Users, ArrowUp, HandMetal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Decentralized by Design",
    description: "No single point of failure. Your code is distributed and always accessible.",
    icon: <Network className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "ICP-Powered Security",
    description: "Leveraging ICP's advanced cryptography and tamper-proof ledger for unparalleled security and integrity.",
    icon: <Shield className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Censorship-Resistant",
    description: "Your projects remain yours, free from external interference or arbitrary takedowns.",
    icon: <HandMetal className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Community-Driven Development",
    description: "Foster a vibrant and secure open-source community with true ownership.",
    icon: <Users className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Scalable & Efficient",
    description: "Built on the Internet Computer, Dgit offers the scalability and performance needed for modern development.",
    icon: <ArrowUp className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Familiar Git Workflow",
    description: "Seamlessly integrate with your existing Git workflows. No steep learning curve.",
    icon: <GitBranch className="h-12 w-12 text-purple-500" />,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 purple-glow">
            Why Choose <span className="text-cta">Dgit</span>?
          </h2>
          <p className="text-white/80 text-lg">
            Experience the next evolution of code hosting with features designed for the modern, security-conscious developer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary/30 border border-purple-900/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-heading text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/20 to-transparent"></div>
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-purple-900/20 blur-3xl animate-pulse-slow"></div>
    </section>
  );
};

export default FeaturesSection;
