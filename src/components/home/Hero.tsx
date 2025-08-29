import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContactFormDialog from "@/components/forms/ContactFormDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChevronRight, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import agricultureHeroBg from "@/assets/agriculture-hero-bg.jpg";

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const isMobile = useIsMobile();

  const scrollToFactCheck = () => {
    const element = document.querySelector('.agrifactcheck-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Shield, value: "99.9%", label: "Accuracy Rate" },
    { icon: TrendingUp, value: "10K+", label: "Verified Claims" },
    { icon: Users, value: "5K+", label: "Active Users" },
  ];

  const features = [
    "AI-Powered Fact Checking",
    "Real-time Misinformation Detection", 
    "Expert Agricultural Insights",
    "24/7 Monitoring & Alerts"
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Advanced Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${agricultureHeroBg})` }}
        />
        <div className="absolute inset-0 ag-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/80" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-primary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-harvest-gold rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-8 animate-fade-in">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Advanced AI Technology
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-white">Revolutionizing</span>
                <br />
                <span className="ag-text-gradient">Agricultural Truth</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
                Combat agricultural misinformation with our cutting-edge AI platform. 
                Get verified facts, expert insights, and real-time monitoring to make informed farming decisions.
              </p>
            </div>

            {/* Feature List */}
            <div className="mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2 text-white/80">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm md:text-base font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <Button
                  onClick={scrollToFactCheck}
                  size="lg"
                  className="ag-btn-primary text-lg px-10 py-4 h-auto group hover:scale-105 transition-all duration-300 ag-shadow-large"
                >
                  {isMobile ? "Start Fact-Checking" : "Discover Agricultural Facts"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  onClick={() => setContactFormOpen(true)}
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-4 h-auto bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary backdrop-blur-sm transition-all duration-300"
                >
                  {isMobile ? "Learn More" : "Get Enterprise Demo"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm md:text-base text-white/70 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <ContactFormDialog
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
      />
    </>
  );
};

export default Hero;