
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";
import ContactFormDialog from "@/components/forms/ContactFormDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const isMobile = useIsMobile();
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
      className={`relative ${isMobile ? 'min-h-[50vh]' : 'min-h-screen'} flex items-${isMobile ? 'start pt-16' : 'center'} bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url('${wheatBackground}')`,
        backgroundSize: isMobile ? 'cover' : 'cover',
        backgroundPosition: isMobile ? 'center top' : 'center center'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Tree overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-green-900/30"></div>
      
      <div className={`container mx-auto px-4 ${isMobile ? 'py-4' : 'py-24'} flex items-center justify-center relative z-10`}>
        {/* Centered Content */}
        <div className="w-full text-center">
          <div className={`${isMobile ? 'mb-2' : 'mb-6'}`}>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-6xl md:text-7xl'} font-bold tracking-tight text-white ${isMobile ? 'mb-1' : 'mb-4'}`}>
              AgriGuard
            </h1>
            <h3 className={`${isMobile ? 'text-sm' : 'text-2xl md:text-3xl'} font-semibold text-green-300 ${isMobile ? 'mb-1' : 'mb-4'}`}>
              Technological Solutions
            </h3>
          </div>
          
          <div className={`bg-black/20 backdrop-blur-sm rounded-lg ${isMobile ? 'p-2.5 mb-3 max-w-sm' : 'p-6 mb-8 max-w-4xl'} mx-auto`}>
            {isMobile ? (
              <p className="text-xs text-white/95 leading-relaxed text-center">
                Trusted agricultural information. Combat misinformation with science.
              </p>
            ) : (
              <>
                <p className="text-lg md:text-xl text-white/95 mb-4 leading-relaxed">
                  Your trusted source for accurate agricultural biotechnology information. 
                  We combat agricultural misinformation and provide farmers with science-based facts 
                  about modern farming technologies.
                </p>
                <p className="text-md text-green-200 leading-relaxed">
                  Empowering farmers with reliable knowledge about crop genetics, biotechnology, 
                  and sustainable agricultural practices for a food-secure future.
                </p>
              </>
            )}
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col items-center space-y-2 max-w-xs mx-auto' : 'flex-wrap justify-center gap-4'}`}>
            <Button 
              size={isMobile ? "sm" : "lg"}
              className={`bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-black ${isMobile ? 'px-3 py-1 text-xs w-full' : 'px-8 py-3'} rounded-full font-medium tracking-wider transition-all duration-300`}
              onClick={scrollToFactCheck}
            >
              {isMobile ? 'AGRI FACTS' : 'DISCOVER AGRICULTURAL FACTS'}
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "lg"}
              className={`bg-white/10 border border-white text-white hover:bg-white hover:text-black ${isMobile ? 'px-3 py-1 text-xs w-full' : 'px-8 py-3'} rounded-full font-medium tracking-wider transition-all duration-300`}
              onClick={() => setContactFormOpen(true)}
            >
              {isMobile ? 'LEARN MORE' : 'Learn More'}
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
