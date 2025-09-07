
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Image, FileText, Globe, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
}

const NewsAndPhotos = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('news-api', {
        body: { 
          searchQuery: 'agriculture Africa farming sustainable crops technology'
        }
      });

      if (error) throw error;

      if (data && data.data) {
        const processedArticles = data.data.slice(0, 6).map((article: any) => ({
          title: article.title || 'No title available',
          description: article.description || article.snippet || 'No description available',
          url: article.url || '#',
          image_url: article.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop",
          published_at: article.published_at || new Date().toISOString(),
          source: article.source || 'Unknown Source'
        }));
        
        setArticles(processedArticles);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Fallback to static content if API fails
      setArticles(staticNewsItems);
    } finally {
      setLoading(false);
    }
  };

  const staticNewsItems = [
    {
      title: "African Agricultural Technology Foundation Releases Drought-Tolerant Maize Varieties",
      description: "New drought-tolerant maize varieties developed through the TELA Maize Project show 25-35% yield advantage under drought conditions compared to commercial varieties.",
      url: "#",
      image_url: "https://images.unsplash.com/photo-1534991187874-8c2eacdac486?q=80&w=500&auto=format&fit=crop",
      published_at: new Date().toISOString(),
      source: "AATF"
    },
    {
      title: "AGRA Program Empowers 7,000 Farmers with Climate-Smart Agricultural Techniques",
      description: "The Alliance for a Green Revolution in Africa (AGRA) has successfully trained over 7,000 smallholder farmers in Tanzania on climate-smart agricultural practices.",
      url: "#",
      image_url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a4?q=80&w=500&auto=format&fit=crop",
      published_at: new Date().toISOString(),
      source: "AGRA"
    },
    {
      title: "New Research Debunks Myths About Agricultural Technology Safety in African Food Systems",
      description: "A comprehensive study by the African Union's Scientific, Technical and Research Commission provides evidence-based analysis on agricultural technology safety for both human health and environmental conservation.",
      url: "#",
      image_url: "https://images.unsplash.com/photo-1574943320219-5650d380a722?q=80&w=500&auto=format&fit=crop",
      published_at: new Date().toISOString(),
      source: "AU-STRC"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Additional Resources for your Agricultural Journey
          </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading latest resources...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {articles.slice(0, 3).map((item, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
                <div className="relative">
                  <AspectRatio ratio={4/3} className="bg-gray-50">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop";
                      }}
                    />
                  </AspectRatio>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight min-h-[56px]">
                    {item.title.length > 60 ? `${item.title.substring(0, 60)}...` : item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-base leading-relaxed mb-8 min-h-[72px]">
                    {item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}
                  </p>
                  
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors text-base group"
                  >
                    View Now
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-16">
          <Button className="gap-2 bg-green-600 hover:bg-green-700 px-10 py-4 text-lg font-semibold rounded-xl" asChild>
            <Link to="/blogs">
              <Newspaper className="h-5 w-5" />
              Explore All Resources
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Badge component for indicating article type with agricultural theme
const Badge = ({ type }: { type: string }) => {
  let bgColor = "bg-green-600 text-white";
  let icon = <Newspaper className="h-3 w-3 mr-1" />;
  
  if (type === "photo") {
    bgColor = "bg-blue-600 text-white";
    icon = <Image className="h-3 w-3 mr-1" />;
  } else if (type === "blog") {
    bgColor = "bg-orange-600 text-white";
    icon = <Newspaper className="h-3 w-3 mr-1" />;
  } else if (type === "resource") {
    bgColor = "bg-amber-600 text-white";
    icon = <FileText className="h-3 w-3 mr-1" />;
  }
  
  return (
    <span className={`text-xs px-3 py-1.5 rounded-full flex items-center font-medium ${bgColor}`}>
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default NewsAndPhotos;
