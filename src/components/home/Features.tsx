
import React from "react";
import { Search, MessageSquare, Video, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const featuresList = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "ViralFarm",
    description: "AI-powered detection of trending agricultural myths across social media and radio.",
    comingSoon: true,
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "AgriFactCheck",
    description: "Instant fact-checking via AI chatbot and SMS to provide farmers with accurate information.",
    comingSoon: false,
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "MythBuster Ag",
    description: "AI-generated educational videos to proactively counter common agricultural misinformation.",
    comingSoon: true,
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Integrated Ecosystem",
    description: "All three modules work together in a seamless pipeline to detect, debunk, and prevent misinformation.",
    comingSoon: true,
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          All-in-One AI Solution
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index}
              className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow bg-white text-center"
            >
              <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
                {feature.icon}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                {feature.comingSoon && (
                  <Badge variant="outline" className="text-xs bg-primary-light/30 text-primary-dark border-primary-light">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
