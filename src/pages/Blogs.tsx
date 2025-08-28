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

interface BlogArticle {
  title: string;
  description: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
}

const Blogs = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "All Articles", query: "agriculture Africa farming sustainable crops technology" },
    { id: "climate", name: "Climate Smart", query: "climate smart agriculture Africa sustainable farming" },
    { id: "technology", name: "AgTech", query: "agricultural technology Africa farming innovation digital" },
    { id: "crops", name: "Crop Management", query: "crop management Africa farming yields seeds varieties" },
    { id: "livestock", name: "Livestock", query: "livestock farming Africa cattle poultry sustainable" },
    { id: "policy", name: "Policy & Trade", query: "agricultural policy Africa trade farming regulations" }
  ];

  useEffect(() => {
    fetchBlogs();
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
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, articles]);

  const staticBlogItems = [
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
    },
    {
      title: "Climate-Smart Agriculture Techniques Boost Yields in Sub-Saharan Africa",
      description: "Innovative farming methods including precision agriculture, water-efficient irrigation systems, and soil health management are helping farmers adapt to changing climate conditions.",
      url: "#",
      image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop",
      published_at: new Date().toISOString(),
      source: "Climate Agriculture Initiative"
    },
    {
      title: "Digital Extension Services Transform Rural Farming Communities",
      description: "Mobile technology and digital platforms are revolutionizing how agricultural information and services reach smallholder farmers across Africa.",
      url: "#",
      image_url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=500&auto=format&fit=crop",
      published_at: new Date().toISOString(),
      source: "Digital Agriculture Network"
    },
    {
      title: "Sustainable Pest Management Reduces Chemical Dependency",
      description: "Integrated pest management strategies combining biological controls, resistant varieties, and targeted applications are improving crop health while reducing environmental impact.",
      url: "#",
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&auto=format&fit=crop",
      published_at: new Date().toISOString(),
      source: "Sustainable Agriculture Foundation"
    }
  ];

  const fetchBlogs = async (customQuery?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('news-api', {
        body: { 
          searchQuery: customQuery || 'agriculture Africa farming sustainable crops technology'
        }
      });

      if (error) throw error;
      
      // Check if the API response contains an error (like usage limits)
      if (data && data.error) {
        throw new Error(data.error.message || 'API error occurred');
      }

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
        
        toast({
          title: "Latest blogs loaded",
          description: "Successfully loaded the most recent agricultural blogs.",
        });
      } else {
        // No data returned, use fallback
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Fallback to static content if API fails
      setArticles(staticBlogItems);
      setFilteredArticles(staticBlogItems);
      
      toast({
        title: "Showing featured content",
        description: "Displaying curated agricultural blog content while latest updates load.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchBlogs(searchQuery);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      fetchBlogs(category.query);
    }
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <h1 className="text-3xl font-bold text-green-900">Agricultural Blogs</h1>
            </div>
            
            {/* Category Navigation */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={`${
                      selectedCategory === category.id 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <form onSubmit={handleSearch} className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search agricultural blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
                <Button onClick={() => fetchBlogs()} disabled={loading} variant="outline">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                </Button>
              </form>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Loading latest agricultural blogs...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentArticles.map((article, index) => (
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
                        Blog
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

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`${
                        currentPage === page 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Next
                </Button>
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

export default Blogs;