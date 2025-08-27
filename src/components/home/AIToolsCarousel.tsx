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
  Zap,
  Video,
  AlertTriangle,
  Play
} from "lucide-react";

// Import background images
import pestDetectionBg from "@/assets/pest-detection-bg.jpg";
import cropRecommendationBg from "@/assets/crop-recommendation-bg.jpg";
import factCheckBg from "@/assets/fact-check-bg.jpg";
import videoGenerationBg from "@/assets/video-generation-bg.jpg";

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
  backgroundImage: string;
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
    shadowColor: "shadow-red-500/20",
    backgroundImage: pestDetectionBg
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
    shadowColor: "shadow-green-500/20",
    backgroundImage: cropRecommendationBg
  },
  {
    id: "fact-check",
    title: "Agricultural Fact Checker",
    description: "Verify agricultural information and detect misinformation with AI-powered analysis.",
    icon: <Shield className="h-8 w-8" />,
    features: ["Fact Verification", "Source Analysis", "Myth Busting", "Expert Validation"],
    link: "/fact-check",
    badge: "Truth Analysis",
    gradient: "from-blue-500 via-purple-500 to-indigo-500",
    shadowColor: "shadow-blue-500/20",
    backgroundImage: factCheckBg
  },
  {
    id: "video-generation",
    title: "Educational Video Creator",
    description: "Generate engaging agricultural educational videos with AI-powered content creation.",
    icon: <Video className="h-8 w-8" />,
    features: ["Auto Generation", "Voice Narration", "Custom Scripts", "HD Quality"],
    link: "/video-generation",
    badge: "AI Media",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    shadowColor: "shadow-purple-500/20",
    backgroundImage: videoGenerationBg
  }
];

const AIToolsCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [api]);

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

        <div className="max-w-6xl mx-auto">
          <Carousel 
            setApi={setApi}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              dragFree: false,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {aiTools.map((tool, index) => (
                <CarouselItem key={tool.id} className="pl-2 md:pl-4 md:basis-4/5 lg:basis-2/3">
                  <div className="p-1">
                    <Card className={`relative overflow-hidden ${tool.shadowColor} shadow-xl hover:shadow-2xl transition-all duration-500 border-0 group h-80 flex flex-col`}>
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${tool.backgroundImage})` }}
                      />
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-85`}></div>
                      
                      {/* Dark overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/20"></div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full p-6">
                        <div className="flex items-start justify-between mb-4">
                          {/* Icon and Badge */}
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 group-hover:scale-110 transition-transform duration-300">
                              <div className="text-white">
                                {tool.icon}
                              </div>
                            </div>
                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs font-medium px-2 py-1">
                              {tool.badge}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Title and Description */}
                        <div className="flex-grow">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
                            {tool.title}
                          </h3>
                          <p className="text-white/90 text-sm leading-relaxed mb-4">
                            {tool.description}
                          </p>
                          
                          {/* Features */}
                          <div className="grid grid-cols-2 gap-1 mb-4">
                            {tool.features.slice(0, 4).map((feature, featureIndex) => (
                              <div 
                                key={featureIndex}
                                className="flex items-center gap-1.5 text-white/80 text-xs"
                              >
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0"></div>
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <Button 
                            asChild 
                            size="sm"
                            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 flex-1"
                          >
                            <Link to={tool.link} className="flex items-center justify-center gap-1.5">
                              <Play className="h-3 w-3" />
                              Try Now
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            asChild 
                            size="sm"
                            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 flex-1"
                          >
                            <Link to="/tools" className="flex items-center justify-center gap-1.5">
                              <Target className="h-3 w-3" />
                              Learn More
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm -left-12 md:-left-16 shadow-lg" />
            <CarouselNext className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm -right-12 md:-right-16 shadow-lg" />
          </Carousel>
          
          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {aiTools.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === (current - 1) 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
          
          {/* Progress indicator */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              {current} of {count} tools
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIToolsCarousel;