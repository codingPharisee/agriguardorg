import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, Users, BarChart3 } from 'lucide-react';

const SystemShowcase = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Trusted Information",
      description: "Effectively combat agricultural misinformation with embedded enterprise-grade fact-checking, user management, and verification systems."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Insights", 
      description: "Monitor and analyze agricultural trends, pest outbreaks, and crop recommendations with advanced AI-powered detection and early warning systems."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Engagement",
      description: "Connect farmers, extension officers, and agricultural experts through integrated communication tools and collaborative learning platforms."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green-400 mb-4 tracking-wider uppercase">
            AgriGuard Platform
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Only Unified AI Platform for 
            <br />
            <span className="text-green-400">Agricultural Information</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Trusted distribution, real-time insights,
            you need to elevate agricultural productivity to save your organization time, money, and risk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="border-l-4 border-green-400 bg-slate-800/50 rounded-r-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-green-400/10 rounded-lg text-green-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More →
              </Button>
            </div>
          </div>

          {/* Right side - Platform Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-600">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-500">AgriGuard Dashboard</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Fact Check Status</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-700">287</div>
                      <div className="text-xs text-blue-600">Verified</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-amber-700">43</div>
                      <div className="text-xs text-amber-600">Pending</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-red-700">12</div>
                      <div className="text-xs text-red-600">Flagged</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Crop recommendation verified</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Pest identification active</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Myth detection running</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemShowcase;