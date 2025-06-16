import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, Search, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [searchQuery, articles]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Note: In a real implementation, this API call should be made through a backend service
      // to keep the API key secure. For now, we'll use mock data.
      
      // Mock agricultural news data
      const mockArticles = [
        {
          title: "New Drought-Resistant Crop Varieties Show Promise in East Africa",
          description: "Scientists have developed new varieties of maize and sorghum that can withstand extended drought periods, offering hope for farmers facing climate change challenges.",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=500&auto=format&fit=crop",
          publishedAt: "2024-01-15T10:30:00Z",
          source: { name: "African Agricultural Research" }
        },
        {
          title: "Digital Agriculture Tools Transform Smallholder Farming in Kenya",
          description: "Mobile applications providing weather forecasts, market prices, and farming advice are helping smallholder farmers increase productivity and income.",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=500&auto=format&fit=crop",
          publishedAt: "2024-01-14T08:15:00Z",
          source: { name: "Tech in Agriculture" }
        },
        {
          title: "Sustainable Farming Practices Reduce Soil Erosion by 60%",
          description: "A comprehensive study across sub-Saharan Africa shows that implementing sustainable farming practices significantly reduces soil erosion and improves crop yields.",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=500&auto=format&fit=crop",
          publishedAt: "2024-01-13T14:45:00Z",
          source: { name: "Sustainability Today" }
        },
        {
          title: "Climate-Smart Agriculture Initiative Reaches 50,000 Farmers",
          description: "The Alliance for a Green Revolution in Africa (AGRA) announces that their climate-smart agriculture program has successfully trained 50,000 farmers across 10 countries.",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop",
          publishedAt: "2024-01-12T11:20:00Z",
          source: { name: "AGRA News" }
        },
        {
          title: "Innovative Irrigation Systems Cut Water Usage by 40%",
          description: "New smart irrigation technologies are helping African farmers reduce water consumption while maintaining or increasing crop yields, addressing water scarcity concerns.",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&auto=format&fit=crop",
          publishedAt: "2024-01-11T16:00:00Z",
          source: { name: "Water & Agriculture Journal" }
        },
        {
          title: "Organic Certification Program Boosts Farmer Incomes",
          description: "A new organic certification initiative in West Africa is helping farmers access premium markets and increase their incomes by up to 30%.",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=500&auto=format&fit=crop",
          publishedAt: "2024-01-10T09:30:00Z",
          source: { name: "Organic Farming Africa" }
        }
      ];

      setArticles(mockArticles);
      setFilteredArticles(mockArticles);
      setLoading(false);

      toast({
        title: "News loaded",
        description: "Latest agricultural news has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
      toast({
        title: "Error loading news",
        description: "Unable to load the latest news. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-green-900">Agricultural News</h1>
            </div>
            
            <div className="mb-8">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search news articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchNews} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Loading latest agricultural news...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <AspectRatio ratio={16/9} className="bg-gray-100">
                        <img
                          src={article.urlToImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <Badge className="absolute top-3 right-3 bg-green-600">
                        <Newspaper className="h-3 w-3 mr-1" />
                        News
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.publishedAt)}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{article.source.name}</span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            Read More <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search terms or check back later for new content.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
