
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What makes Dgit different from traditional Git hosts?",
      answer: "Dgit leverages the Internet Computer Protocol to provide a fully decentralized hosting solution. Unlike traditional Git hosts, your repositories are distributed across a network rather than stored on centralized servers, giving you true ownership, censorship resistance, and enhanced security."
    },
    {
      question: "Do I need to learn new commands to use Dgit?",
      answer: "Not at all! Dgit is designed to work with standard Git commands and workflows. If you're familiar with Git, you'll find the transition to Dgit seamless. We provide a simple client that integrates with your existing toolchain."
    },
    {
      question: "Is Dgit compatible with existing Git tools and IDEs?",
      answer: "Yes, Dgit is designed to be compatible with your favorite Git tools, IDEs, and CI/CD pipelines. Our goal is to enhance your development experience without disrupting your workflow."
    },
    {
      question: "How does Dgit ensure the security of my code?",
      answer: "Dgit leverages the cryptographic security of the Internet Computer Protocol, which uses advanced threshold cryptography and a distributed architecture. Your code is encrypted, and access control is managed through blockchain-based identity and permissions systems."
    },
    {
      question: "What happens if the Dgit team disappears?",
      answer: "That's the beauty of decentralization! Since Dgit operates on the Internet Computer Protocol, your repositories would continue to be accessible even if our team ceased operations. The protocol is designed to be self-sustaining with governance handled by the community."
    },
    {
      question: "When will Dgit be available for public use?",
      answer: "We're currently in private beta with select partners. Sign up for early access to be among the first to experience Dgit when we begin our public beta in the coming months."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background to-secondary/20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 purple-glow">
            Frequently Asked <span className="text-cta">Questions</span>
          </h2>
          <p className="text-white/80 text-lg">
            Everything you need to know about Dgit and how it can transform your development workflow.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-purple-900/30"
              >
                <AccordionTrigger className="text-white hover:text-cta font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-white/60">
            Have more questions? <a href="#contact" className="text-purple-400 hover:text-cta underline">Contact our team</a>
          </p>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl animate-pulse-slow"></div>
    </section>
  );
};

export default FAQSection;
