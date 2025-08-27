import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Sprout, 
  Camera, 
  Leaf, 
  TrendingUp, 
  MapPin,
  Shield,
  Target,
  Zap
} from "lucide-react";

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  link: string;
  badge: string;
  gradient: string;
  shadowColor: string;
}

const aiTools: AITool[] = [
  {
    id: "pest-identification",
    title: "Smart Pest & Disease Detection",
    description: "AI-powered identification through your phone camera with instant treatment recommendations.",
    icon: <Bug className="h-8 w-8" />,
    features: ["Camera Recognition", "Treatment Plans", "Expert Analysis", "Instant Results"],
    link: "/pest-identification",
    badge: "AI Vision",
    gradient: "from-red-500 via-orange-500 to-amber-500",
    shadowColor: "shadow-red-500/20"
  },
  {
    id: "crop-recommendations",
    title: "Personalized Crop Advisory",
    description: "Smart recommendations based on your location, soil conditions, and weather patterns.",
    icon: <Sprout className="h-8 w-8" />,
    features: ["Soil Analysis", "Weather Integration", "Market Insights", "Seasonal Calendar"],
    link: "/crop-recommendations",
    badge: "Smart Agriculture",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    shadowColor: "shadow-green-500/20"
  }
];

const AIToolsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % aiTools.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary animate-pulse" />
            <Badge variant="secondary" className="text-sm font-medium">
              All-in-One Agricultural AI Solution
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Smart Farming Tools at Your Fingertips
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Leverage cutting-edge AI technology to enhance your agricultural practices with instant analysis and personalized recommendations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {aiTools.map((tool, index) => (
                <CarouselItem key={tool.id}>
                  <div className="p-1">
                    <Card className={`relative overflow-hidden bg-gradient-to-br ${tool.gradient} ${tool.shadowColor} shadow-xl hover:shadow-2xl transition-all duration-500 border-0 group`}>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div className="relative z-10">
                        <CardHeader className="text-center pb-4">
                          <div className="flex items-center justify-center mb-4">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                              <div className="text-white">
                                {tool.icon}
                              </div>
                            </div>
                          </div>
                          <Badge className="mx-auto mb-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            {tool.badge}
                          </Badge>
                          <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {tool.title}
                          </CardTitle>
                          <p className="text-white/90 text-lg max-w-lg mx-auto leading-relaxed">
                            {tool.description}
                          </p>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            {tool.features.map((feature, featureIndex) => (
                              <div 
                                key={featureIndex}
                                className="flex items-center gap-2 text-white/90 text-sm"
                              >
                                <div className="w-2 h-2 bg-white/60 rounded-full flex-shrink-0"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button asChild className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                              <Link to={tool.link} className="flex items-center gap-2">
                                <Camera className="h-4 w-4" />
                                Try Now
                              </Link>
                            </Button>
                            <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-6 py-3 rounded-full transition-all duration-300">
                              <Link to="/tools" className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Learn More
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
            <CarouselNext className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
          </Carousel>
          
          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {aiTools.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIToolsCarousel;