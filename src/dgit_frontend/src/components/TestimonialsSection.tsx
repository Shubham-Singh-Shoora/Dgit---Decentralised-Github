
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const testimonials = [
  {
    quote: "Dgit has transformed how our team collaborates. The decentralized approach means we never worry about downtime or censorship issues.",
    author: "Alex Chen",
    role: "CTO, BlockStack",
    avatar: "AC"
  },
  {
    quote: "The seamless integration with my existing Git workflow made switching to Dgit a no-brainer. The added security of ICP is a game changer.",
    author: "Sarah Johnson",
    role: "Lead Developer, Open Protocol",
    avatar: "SJ"
  },
  {
    quote: "As someone passionate about decentralization, Dgit is exactly what the development world needed. Finally, true ownership of our code repositories.",
    author: "Michael Okonjo",
    role: "Developer Advocate, ICP Labs",
    avatar: "MO"
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-network-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-800/10 blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 purple-glow">
            What Developers Are <span className="text-cta">Saying</span>
          </h2>
          <p className="text-white/80 text-lg">
            Join the growing community of developers who have embraced the future of decentralized code hosting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-secondary/40 border border-purple-900/30 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="flex flex-col h-full justify-between">
                  <div className="mb-6">
                    <p className="text-white/80 italic">"{testimonial.quote}"</p>
                  </div>
                  
                  <div>
                    <Separator className="bg-purple-800/30 mb-6" />
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-purple-800 text-white">{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{testimonial.author}</p>
                        <p className="text-sm text-purple-300">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
