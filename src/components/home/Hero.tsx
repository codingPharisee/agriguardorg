
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";
import ContactFormDialog from "@/components/forms/ContactFormDialog";

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  // Static wheat background
  const wheatBackground = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop";

  const scrollToFactCheck = () => {
    const factCheckSection = document.querySelector('.agrifactcheck-section');
    if (factCheckSection) {
      factCheckSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${wheatBackground}')`
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Tree overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-green-900/30"></div>
      
      <div className="container mx-auto px-4 py-24 flex items-center justify-center relative z-10">
        {/* Centered Content */}
        <div className="w-full text-center">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
              AgriGuard
            </h1>
            <h3 className="text-2xl md:text-3xl font-semibold text-green-300 mb-4">
              Technological Solutions
            </h3>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-white/95 mb-4 leading-relaxed">
              Your trusted source for accurate GMO (Genetically Modified Organism) information. 
              We combat agricultural misinformation and provide farmers with science-based facts 
              about modern farming technologies.
            </p>
            <p className="text-md text-green-200 leading-relaxed">
              Empowering farmers with reliable knowledge about crop genetics, biotechnology, 
              and sustainable agricultural practices for a food-secure future.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-3 rounded-full font-medium tracking-wider transition-all duration-300"
              onClick={scrollToFactCheck}
            >
              DISCOVER GMO FACTS
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-medium tracking-wider transition-all duration-300"
              onClick={() => setContactFormOpen(true)}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <ContactFormDialog 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen} 
      />
    </div>
  );
};

export default Hero;
