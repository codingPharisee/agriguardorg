
import React from "react";
import { Search, MessageSquare, Video, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const featuresList = [
  {
    icon: <Search className="h-8 w-8 text-amber-600" />,
    title: "ViralFarm",
    description: "AI-powered detection of trending agricultural myths across social media and radio.",
    comingSoon: true,
    path: "/viral-farm",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-amber-600" />,
    title: "AgriFactCheck",
    description: "Instant fact-checking via AI chatbot and SMS to provide farmers with accurate information.",
    comingSoon: false,
    path: "/fact-check",
  },
  {
    icon: <Video className="h-8 w-8 text-amber-600" />,
    title: "MythBuster Ag",
    description: "AI-generated educational videos to proactively counter common agricultural misinformation.",
    comingSoon: true,
    path: "/myth-buster",
  },
  {
    icon: <Shield className="h-8 w-8 text-amber-600" />,
    title: "Integrated Ecosystem",
    description: "All three modules work together in a seamless pipeline to detect, debunk, and prevent misinformation.",
    comingSoon: true,
    path: "/ecosystem",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-900">
          All-in-One Agricultural AI Solution
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <Link
              key={index}
              to={feature.comingSoon ? "#" : feature.path}
              className={`block h-full transition-all ${feature.comingSoon ? 'cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <div 
                className="border border-amber-200 rounded-lg p-6 shadow-lg transition-shadow bg-white hover:shadow-xl text-center h-full flex flex-col"
              >
                <div className="inline-flex items-center justify-center bg-amber-100 p-4 rounded-full mb-4 mx-auto">
                  {feature.icon}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-amber-900">{feature.title}</h3>
                  {feature.comingSoon && (
                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 text-sm flex-grow leading-relaxed">{feature.description}</p>
                {!feature.comingSoon && (
                  <div className="mt-4 mx-auto">
                    <Badge className="bg-amber-600 text-white hover:bg-amber-700">
                      Explore Now
                    </Badge>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
