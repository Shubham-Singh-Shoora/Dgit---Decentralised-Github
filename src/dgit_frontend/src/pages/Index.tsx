
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import InteractiveEntryPage from "@/components/InteractiveEntryPage";

const Index = () => {
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited the landing page before
    const hasVisited = localStorage.getItem('hasVisitedLandingPage');
    setShowLandingPage(hasVisited === 'true');
    setIsLoading(false);

    // Listen for the entry page completion event
    const handleEntryComplete = () => {
      setShowLandingPage(true);
    };

    window.addEventListener('entryPageComplete', handleEntryComplete);
    
    return () => {
      window.removeEventListener('entryPageComplete', handleEntryComplete);
    };
  }, []);

  // Show loading state briefly while checking localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  // Show entry page if user hasn't visited before
  if (!showLandingPage) {
    return <InteractiveEntryPage />;
  }

  // Show main landing page if user has visited before
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
