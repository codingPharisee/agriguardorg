
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ViralFarm from "@/components/modules/ViralFarm";
import { Button } from "@/components/ui/button";
import { Info, Shield } from "lucide-react";

const ViralFarmPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-primary-light/20 via-white to-earth-light/10 py-8 px-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-dark/10 text-primary-dark px-3 py-1.5 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              <span>Real-time Misinformation Monitoring</span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
              ViralFarm: Agricultural Misinformation Tracker
            </h1>
            
            <p className="text-lg text-gray-700 max-w-3xl">
              Monitor and analyze potential agricultural misinformation in real-time 
              across social media and online platforms before it can spread widely.
            </p>
          </div>
        </div>
        
        <div className="py-8 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <ViralFarm fullPage={true} />
            
            <div className="bg-primary-dark/5 rounded-lg p-6 border border-primary-dark/10">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                How ViralFarm Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-md border shadow-sm">
                  <h3 className="font-medium mb-2 text-primary-dark">1. Continuous Monitoring</h3>
                  <p className="text-sm text-gray-600">
                    Our system monitors social media, messaging apps, and forums 24/7 to detect emerging agricultural myths and misinformation patterns.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-md border shadow-sm">
                  <h3 className="font-medium mb-2 text-primary-dark">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Advanced AI algorithms classify content as potential misinformation and analyze spread patterns to determine severity and potential impact.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-md border shadow-sm">
                  <h3 className="font-medium mb-2 text-primary-dark">3. Early Response</h3>
                  <p className="text-sm text-gray-600">
                    Get immediate alerts about emerging misinformation so you can develop and distribute accurate information before myths take root.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button className="gap-2">
                  <Shield className="h-4 w-4" />
                  Set Up Custom Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViralFarmPage;
