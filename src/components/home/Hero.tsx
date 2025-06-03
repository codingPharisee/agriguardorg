
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";
import ContactFormDialog from "@/components/forms/ContactFormDialog";

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);

  const scrollToFactCheck = () => {
    const factCheckSection = document.querySelector('.agrifactcheck-section');
    if (factCheckSection) {
      factCheckSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop')`
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Tree overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-amber-900/30"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-24">
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
            AGRO
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-white">
            FARMING COMPANY
          </h2>
        </div>
        
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
          opposed to using 'Content here, content here', making it look like readable English
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-8 py-3 rounded-full font-medium tracking-wider transition-all duration-300"
            onClick={scrollToFactCheck}
          >
            DISCOVER
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
