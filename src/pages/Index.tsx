
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
        <section className="py-16 bg-gradient-to-br from-white via-green-50/30 to-amber-50/20 agrifactcheck-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-6 lg:p-8 order-2 lg:order-1">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-800 to-amber-800 bg-clip-text text-transparent">AI-Powered Agricultural Fact Checking for African Farmers</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  AgriFactCheck provides African farmers with instant, verified responses to agricultural questions using
                  AI-powered fact checking technology. Combat farming myths and misinformation with evidence-based 
                  agricultural guidance from trusted African agricultural authorities and research institutions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">SMS and WhatsApp fact checking service for remote farmers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Preloaded with verified FAQs from African agricultural authorities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">Citations from trusted scientific sources</span>
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
        
        {/* AI Modules section with enhanced styling */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800">
              Advanced AI Tools for Modern African Agriculture
            </h2>
            
            <div className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="order-2 lg:order-1">
                  <ViralFarm />
                </div>
                <div className="order-1 lg:order-2 p-6 lg:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">Early Detection of Agricultural Misinformation in Africa</h3>
                  <p className="text-black mb-6 leading-relaxed">
                    ViralFarm uses advanced AI and machine learning to continuously monitor African social media platforms, 
                    WhatsApp groups, radio broadcasts, and community forums to identify emerging agricultural myths 
                    and misinformation before they can spread widely among farming communities across Africa.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-black">Real-time monitoring of trending agricultural topics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-black">AI-powered classification of potential misinformation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-black">Early warning alerts for rapidly spreading myths</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="p-6 lg:p-8 order-1">
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">Educational Video Content for African Farmers</h3>
                  <p className="text-black mb-6 leading-relaxed">
                    MythBuster Ag creates engaging, multilingual educational videos that proactively address
                    common agricultural misconceptions and provide evidence-based farming guidance tailored 
                    for African farming communities, available in local languages and dialects.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-black">AI-generated educational videos in multiple languages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-black">Simplified explanations of complex agricultural concepts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-black">Shareable content for WhatsApp and social media</span>
                    </li>
                  </ul>
                </div>
                <div className="order-2">
                  <MythBusterAg />
                </div>
              </div>
            </div>
          </div>
        </section>
        
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
