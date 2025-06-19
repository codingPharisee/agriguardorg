
import React from "react";
import { Search, MessageSquare, Video, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const featuresList = [
  {
    icon: <Search className="h-8 w-8 text-white" />,
    title: "ViralFarm",
    description: "AI-powered detection of trending agricultural myths across social media and radio.",
    path: "/viral-farm",
    bgImage: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=500&auto=format&fit=crop",
    bgColor: "from-blue-600/90 to-blue-800/90"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    title: "AgriFactCheck",
    description: "Instant fact-checking via AI chatbot and SMS to provide farmers with accurate information.",
    path: "/fact-check",
    bgImage: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=500&auto=format&fit=crop",
    bgColor: "from-green-600/90 to-green-800/90"
  },
  {
    icon: <Video className="h-8 w-8 text-white" />,
    title: "MythBuster Ag",
    description: "AI-generated educational videos to proactively counter common agricultural misinformation.",
    path: "/myth-buster",
    bgImage: "https://images.unsplash.com/photo-1574943320219-5650d380a722?q=80&w=500&auto=format&fit=crop",
    bgColor: "from-amber-600/90 to-orange-700/90"
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: "Integrated Ecosystem",
    description: "All three modules work together in a seamless pipeline to detect, debunk, and prevent misinformation.",
    path: "/ecosystem",
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop",
    bgColor: "from-purple-600/90 to-purple-800/90"
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-800 to-amber-800 bg-clip-text text-transparent">
          All-in-One Agricultural AI Solution
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="block h-full transition-all hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl text-center h-full flex flex-col min-h-[300px]">
                <div className="absolute inset-0">
                  <img 
                    src={feature.bgImage} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor}`}></div>
                </div>
                
                <div className="relative z-10 p-6 flex flex-col h-full text-white">
                  <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-white/90 text-sm flex-grow leading-relaxed mb-4">{feature.description}</p>
                  <div className="mt-auto">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30">
                      Explore Now
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
