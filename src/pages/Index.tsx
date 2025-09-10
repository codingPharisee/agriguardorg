
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ViralFarm from "@/components/modules/ViralFarm";
import AgriFactCheck from "@/components/modules/AgriFactCheck";
import MythBusterAg from "@/components/modules/MythBusterAg";
import NewsAndPhotos from "@/components/home/NewsAndPhotos";
import SystemShowcase from "@/components/home/SystemShowcase";
import { Button } from "@/components/ui/button";
import ContactFormDialog from "@/components/forms/ContactFormDialog";
import useScrollPosition from "@/hooks/useScrollPosition";

const Index = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  useScrollPosition();

  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AgriGuard Tech",
      "description": "AI-powered agricultural fact checking, crop recommendations, and pest identification platform for African farmers",
      "url": "https://agriguardtech.org",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://agriguardtech.org/fact-check?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AgriGuard Tech",
        "url": "https://agriguardtech.org"
      },
      "mainEntity": [
        {
          "@type": "SoftwareApplication",
          "name": "AgriFactCheck",
          "description": "AI-powered agricultural fact checking service",
          "applicationCategory": "AgricultureApplication",
          "operatingSystem": "Web"
        },
        {
          "@type": "Service",
          "name": "Crop Recommendations",
          "description": "AI-powered crop recommendation system for optimal farming decisions",
          "provider": {
            "@type": "Organization",
            "name": "AgriGuard Tech"
          }
        },
        {
          "@type": "Service", 
          "name": "Pest Identification",
          "description": "AI-powered pest and disease identification for crop protection",
          "provider": {
            "@type": "Organization",
            "name": "AgriGuard Tech"
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* System Showcase */}
        <SystemShowcase />
        
        {/* Fact Check section with enhanced styling and SEO optimization */}
        <section className="py-16 bg-white agrifactcheck-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-6 lg:p-8 order-2 lg:order-1">
                <h2 className="text-3xl font-bold mb-4 text-slate-800">AI-Powered Agricultural Fact Checking for African Farmers</h2>
                <p className="text-black mb-6 leading-relaxed">
                  AgriFactCheck provides African farmers with instant, verified responses to agricultural questions using
                  AI-powered fact checking technology. Combat farming myths and misinformation with evidence-based 
                  agricultural guidance from trusted African agricultural authorities and research institutions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-black">SMS and WhatsApp fact checking service for remote farmers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-black">Preloaded with verified FAQs from African agricultural authorities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-black">Citations from trusted scientific sources</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <AgriFactCheck />
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        
        <NewsAndPhotos />

        {/* Call to action with enhanced styling and SEO optimization */}
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800">
              Join Africa's Leading Agricultural Technology Platform
            </h2>
            <p className="mb-8 max-w-2xl mx-auto text-green-700 leading-relaxed">
              Connect with thousands of agricultural experts, extension officers, and progressive farmers 
              across Africa. Access AI-powered crop recommendations, pest identification, and fact-checking 
              services to boost your farm productivity and combat misinformation.
            </p>
            <Button 
              className="bg-green-800 text-white hover:bg-green-700 px-8 py-3 rounded-full font-bold tracking-wide transition-all text-lg shadow-lg"
              onClick={() => setContactFormOpen(true)}
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <ContactFormDialog 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen} 
      />
    </div>
  );
};

export default Index;
