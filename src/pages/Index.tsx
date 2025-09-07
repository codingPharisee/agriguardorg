
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ViralFarm from "@/components/modules/ViralFarm";
import AgriFactCheck from "@/components/modules/AgriFactCheck";
import MythBusterAg from "@/components/modules/MythBusterAg";
import NewsAndPhotos from "@/components/home/NewsAndPhotos";
import AIToolsCarousel from "@/components/home/AIToolsCarousel";
import { Button } from "@/components/ui/button";
import ContactFormDialog from "@/components/forms/ContactFormDialog";
import useScrollPosition from "@/hooks/useScrollPosition";

const Index = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  useScrollPosition();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* AI Tools Carousel */}
        <AIToolsCarousel />
        
        {/* Fact Check section with enhanced styling */}
        <section className="py-16 bg-gradient-to-br from-white via-green-50/30 to-amber-50/20 agrifactcheck-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-6 lg:p-8 order-2 lg:order-1">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-800 to-amber-800 bg-clip-text text-transparent">Instant Agricultural Fact Checking</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  AgriFactCheck provides farmers with immediate responses to their questions about
                  agricultural practices, using a knowledge base built on verified scientific information
                  from trusted African agricultural authorities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">SMS and chat-based fact checking service</span>
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
        
        <NewsAndPhotos />
        
        {/* AI Modules section with enhanced styling */}
        <section className="py-16 bg-gradient-to-br from-green-50 via-amber-50/30 to-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-800 to-amber-800 bg-clip-text text-transparent">
              Explore Our Agricultural AI Modules
            </h2>
            
            <div className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="order-2 lg:order-1">
                  <ViralFarm />
                </div>
                <div className="order-1 lg:order-2 p-6 lg:p-8">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-800 to-amber-800 bg-clip-text text-transparent">Detect Agricultural Misinformation Early</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    ViralFarm uses advanced AI to continuously monitor social media, messaging apps, and radio broadcasts
                    to identify emerging agricultural myths before they can spread widely among farming communities.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">Real-time monitoring of trending agricultural topics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">AI-powered classification of potential misinformation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">Early warning alerts for rapidly spreading myths</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="p-6 lg:p-8 order-1">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-800 to-amber-800 bg-clip-text text-transparent">Proactive Agricultural Education</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    MythBuster Ag creates engaging, easy-to-understand videos that proactively address
                    common agricultural misconceptions before they can take root in farming communities.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">AI-generated educational videos in multiple languages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">Simplified explanations of complex agricultural concepts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-amber-600 rounded-full p-1 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">Shareable content for WhatsApp and social media</span>
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
        
        {/* Call to action with enhanced styling */}
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-800">
              Ready to Combat Agricultural Misinformation?
            </h2>
            <p className="mb-8 max-w-2xl mx-auto text-green-700 leading-relaxed">
              Join our network of agricultural experts, extension officers, and farmers 
              to help build a more informed and prosperous farming community.
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
