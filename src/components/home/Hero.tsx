
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";
import ContactFormDialog from "@/components/forms/ContactFormDialog";

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);

  // Dynamic crop backgrounds
  const cropBackgrounds = [
    {
      name: "Wheat",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Maize",
      image: "https://images.unsplash.com/photo-1551803091-e20673f1bb2e?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Sugarcane",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Rice",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  // Change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCropIndex((prevIndex) => 
        (prevIndex + 1) % cropBackgrounds.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToFactCheck = () => {
    const factCheckSection = document.querySelector('.agrifactcheck-section');
    if (factCheckSection) {
      factCheckSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={{
        backgroundImage: `url('${cropBackgrounds[currentCropIndex].image}')`
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Tree overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-amber-900/30"></div>
      
      {/* Lady with phone image - positioned on the left */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block z-10">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
          alt="Woman learning from phone"
          className="w-80 h-80 object-cover rounded-full border-4 border-amber-400 shadow-2xl"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-24 lg:ml-auto lg:mr-16">
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
            AGRO
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-white mb-6">
            FARMING COMPANY
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-amber-300 mb-4">
            AgriGuard Company
          </h3>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-4 leading-relaxed">
            Your trusted source for accurate GMO (Genetically Modified Organism) information. 
            We combat agricultural misinformation and provide farmers with science-based facts 
            about modern farming technologies.
          </p>
          <p className="text-md text-amber-200 max-w-2xl mx-auto leading-relaxed">
            Empowering farmers with reliable knowledge about crop genetics, biotechnology, 
            and sustainable agricultural practices for a food-secure future.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-8 py-3 rounded-full font-medium tracking-wider transition-all duration-300"
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

      <ContactFormDialog 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen} 
      />
    </div>
  );
};

export default Hero;
