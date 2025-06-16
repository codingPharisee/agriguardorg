
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
import { supabase } from "@/integrations/supabase/client";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
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

  const fetchNews = async (customQuery?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('news-api', {
        body: { 
          searchQuery: customQuery || 'agriculture Africa farming crops sustainable'
        }
      });

      if (error) throw error;

      if (data && data.data) {
        const processedArticles = data.data.map((article: any) => ({
          title: article.title || 'No title available',
          description: article.description || article.snippet || 'No description available',
          url: article.url || '#',
          image_url: article.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop",
          published_at: article.published_at || new Date().toISOString(),
          source: article.source || 'Unknown Source'
        }));
        
        setArticles(processedArticles);
        setFilteredArticles(processedArticles);
      }

      toast({
        title: "News loaded",
        description: "Latest agricultural news has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error loading news",
        description: "Unable to load the latest news. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(searchQuery);
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
              <form onSubmit={handleSearch} className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search agricultural news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
                <Button onClick={() => fetchNews()} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                </Button>
              </form>
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
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop";
                          }}
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
                        {formatDate(article.published_at)}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{article.source}</span>
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
