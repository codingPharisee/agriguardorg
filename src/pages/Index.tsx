
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
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
        
        {/* Fact Check section - compact version */}
        <section className="py-6 bg-white agrifactcheck-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center max-w-5xl mx-auto">
              <div className="p-3 order-2 lg:order-1">
                <h2 className="text-xl lg:text-2xl font-bold mb-2 text-slate-800">AI-Powered Agricultural Fact Checking</h2>
                <p className="text-black mb-3 text-sm leading-relaxed">
                  Get instant, verified responses to agricultural questions using AI-powered fact checking technology.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">SMS & WhatsApp Support</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified FAQs</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Scientific Citations</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="transform scale-75 origin-center">
                  <AgriFactCheck />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* All-in-One Agricultural AI Solution section with clean styling */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                All-in-One Agricultural AI Solution
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Comprehensive AI-powered tools designed specifically for African farmers to combat misinformation, 
                get accurate information, and make informed agricultural decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* ViralFarm Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="bg-blue-600 p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">ViralFarm</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      AI-powered detection of trending agricultural myths across social media and radio.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Real-time monitoring</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Misinformation detection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Early warning alerts</span>
                    </li>
                  </ul>
                  <Link to="/viral-farm">
                    <button className="w-full bg-slate-100 text-slate-800 py-3 px-4 rounded-lg font-semibold hover:bg-slate-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                      Explore Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* AgriFactCheck Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="bg-green-600 p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">AgriFactCheck</h3>
                    <p className="text-green-100 text-sm leading-relaxed">
                      Instant fact-checking via AI chatbot and SMS to provide farmers with accurate information.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">SMS & WhatsApp support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Verified FAQs database</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Scientific citations</span>
                    </li>
                  </ul>
                  <Link to="/fact-check">
                    <button className="w-full bg-slate-100 text-slate-800 py-3 px-4 rounded-lg font-semibold hover:bg-slate-200 transition-colors group-hover:bg-green-50 group-hover:text-green-700">
                      Explore Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* MythBuster Ag Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="bg-orange-600 p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">MythBuster Ag</h3>
                    <p className="text-orange-100 text-sm leading-relaxed">
                      AI-generated educational videos to proactively counter common agricultural misinformation.
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Multilingual videos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Simplified explanations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 rounded-full p-1 mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-700 text-sm">Shareable content</span>
                    </li>
                  </ul>
                  <Link to="/myth-buster">
                    <button className="w-full bg-slate-100 text-slate-800 py-3 px-4 rounded-lg font-semibold hover:bg-slate-200 transition-colors group-hover:bg-orange-50 group-hover:text-orange-700">
                      Explore Now
                    </button>
                  </Link>
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
