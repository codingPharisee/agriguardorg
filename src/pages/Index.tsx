
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ViralFarm from "@/components/modules/ViralFarm";
import AgriFactCheck from "@/components/modules/AgriFactCheck";
import MythBusterAg from "@/components/modules/MythBusterAg";
import NewsAndPhotos from "@/components/home/NewsAndPhotos";
import { Button } from "@/components/ui/button";
import ContactFormDialog from "@/components/forms/ContactFormDialog";

const Index = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Fact Check section now above Features with a class for scrolling */}
        <section className="py-12 bg-white agrifactcheck-section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="p-4 lg:p-8 order-2 lg:order-1">
                <h3 className="text-2xl font-bold mb-4 text-primary-dark">Instant Fact Checking</h3>
                <p className="text-gray-700 mb-4">
                  AgriFactCheck provides farmers with immediate responses to their questions about
                  agricultural practices, using a knowledge base built on verified scientific information.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary rounded-full p-0.5 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>SMS and chat-based fact checking service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary rounded-full p-0.5 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Preloaded with verified FAQs from agricultural authorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary rounded-full p-0.5 mt-1">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>Citations from trusted scientific sources</span>
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
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Explore Our AI Modules
            </h2>
            
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="order-2 lg:order-1">
                  <ViralFarm />
                </div>
                <div className="order-1 lg:order-2 p-4 lg:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary-dark">Detect Misinformation Early</h3>
                  <p className="text-gray-700 mb-4">
                    ViralFarm uses AI to continuously monitor social media, messaging apps, and radio broadcasts
                    to identify emerging agricultural myths before they can spread widely.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary rounded-full p-0.5 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Real-time monitoring of trending agricultural topics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary rounded-full p-0.5 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>AI-powered classification of potential misinformation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary rounded-full p-0.5 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Early warning alerts for rapidly spreading myths</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="p-4 lg:p-8 order-1">
                  <h3 className="text-2xl font-bold mb-4 text-primary-dark">Proactive Education</h3>
                  <p className="text-gray-700 mb-4">
                    MythBuster Ag creates engaging, easy-to-understand videos that proactively address
                    common misconceptions before they can take root in farming communities.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary rounded-full p-0.5 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>AI-generated educational videos in multiple languages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary rounded-full p-0.5 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Simplified explanations of complex agricultural concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary rounded-full p-0.5 mt-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Shareable content for WhatsApp and social media</span>
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
        
        <section className="py-16 bg-primary-dark text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Combat Agricultural Misinformation?
            </h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Join our network of agricultural experts, extension officers, and farmers 
              to help build a more informed farming community.
            </p>
            <Button 
              className="bg-white text-primary-dark hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
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
