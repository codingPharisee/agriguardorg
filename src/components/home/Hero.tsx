
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield } from "lucide-react";
import ContactFormDialog from "@/components/forms/ContactFormDialog";

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-primary-light/20 via-white to-earth-light/10 py-12 px-4 md:py-24 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary-dark/10 text-primary-dark px-3 py-1.5 rounded-full text-sm font-medium mb-2">
          <Shield className="h-4 w-4" />
          <span>Combating Agricultural Misinformation</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-dark">
          AgriGuard: AI-Powered Myth Busting
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          An integrated AI ecosystem that detects, debunks, and prevents the spread of agricultural misinformation to empower farmers with factual knowledge.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" className="gap-2">
            <ShieldCheck className="h-5 w-5" />
            Start Fact Checking
          </Button>
          <Button 
            variant="outline" 
            size="lg"
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
