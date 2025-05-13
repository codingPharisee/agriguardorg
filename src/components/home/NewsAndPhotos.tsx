
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Image, FileText, Globe } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const newsItems = [
  {
    title: "African Agricultural Technology Foundation Releases Drought-Tolerant Maize Varieties",
    excerpt: "New drought-tolerant maize varieties developed through the TELA Maize Project show 25-35% yield advantage under drought conditions compared to commercial varieties.",
    date: "May 8, 2025",
    imageUrl: "https://images.unsplash.com/photo-1534991187874-8c2eacdac486?q=80&w=500&auto=format&fit=crop",
    type: "article"
  },
  {
    title: "AGRA Program Empowers 7,000 Farmers with Climate-Smart Agricultural Techniques",
    excerpt: "The Alliance for a Green Revolution in Africa (AGRA) has successfully trained over 7,000 smallholder farmers in Tanzania on climate-smart agricultural practices.",
    date: "May 1, 2025",
    imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a4?q=80&w=500&auto=format&fit=crop",
    type: "news" 
  },
  {
    title: "New Research Debunks Myths About GMO Safety in African Food Systems",
    excerpt: "A comprehensive study by the African Union's Scientific, Technical and Research Commission provides evidence-based analysis on GMO safety for both human health and environmental conservation.",
    date: "April 26, 2025",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-5650d380a722?q=80&w=500&auto=format&fit=crop",
    type: "article"
  },
  {
    title: "FAO Releases Digital Toolkit for African Extension Services",
    excerpt: "The Food and Agriculture Organization launches a comprehensive digital toolkit designed to help extension workers combat agricultural misinformation in rural communities.",
    date: "April 22, 2025",
    imageUrl: "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=500&auto=format&fit=crop",
    type: "resource"
  },
  {
    title: "Photo Essay: How Conservation Agriculture is Transforming Zambian Farms",
    excerpt: "Visual documentation of the transformation happening across Zambia as farmers adopt conservation agriculture practices with remarkable results.",
    date: "April 15, 2025",
    imageUrl: "https://images.unsplash.com/photo-1542222378-e41f95df8d99?q=80&w=500&auto=format&fit=crop",
    type: "photo"
  },
  {
    title: "CGIAR Breakthrough: New Rice Variety Uses 40% Less Water",
    excerpt: "Scientists at CGIAR have developed a new rice variety that requires significantly less water while maintaining high yields, addressing key challenges faced by African rice farmers.",
    date: "April 10, 2025",
    imageUrl: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?q=80&w=500&auto=format&fit=crop",
    type: "news"
  }
];

const NewsAndPhotos = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Latest News & Resources
          </h2>
          <Newspaper className="h-6 w-6 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <AspectRatio ratio={16/9} className="bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute top-2 right-2">
                  <Badge type={item.type} />
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold line-clamp-2">{item.title}</CardTitle>
                <div className="text-xs text-gray-500">{item.date}</div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 text-sm line-clamp-3">{item.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 gap-4">
          <Button className="gap-2">
            <Newspaper className="h-4 w-4" />
            View All Articles
          </Button>
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            News Sources
          </Button>
        </div>
      </div>
    </section>
  );
};

// Badge component for indicating article type
const Badge = ({ type }: { type: string }) => {
  let bgColor = "bg-primary text-white";
  let icon = <Newspaper className="h-3 w-3 mr-1" />;
  
  if (type === "photo") {
    bgColor = "bg-blue-500 text-white";
    icon = <Image className="h-3 w-3 mr-1" />;
  } else if (type === "news") {
    bgColor = "bg-amber-500 text-white";
    icon = <Newspaper className="h-3 w-3 mr-1" />;
  } else if (type === "resource") {
    bgColor = "bg-green-500 text-white";
    icon = <FileText className="h-3 w-3 mr-1" />;
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${bgColor}`}>
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default NewsAndPhotos;
