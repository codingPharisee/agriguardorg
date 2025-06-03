
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
    <section className="py-16 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-900">
            Latest Agricultural News & Resources
          </h2>
          <Newspaper className="h-8 w-8 text-amber-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow border-amber-200 bg-white">
              <div className="relative">
                <AspectRatio ratio={16/9} className="bg-amber-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute top-3 right-3">
                  <Badge type={item.type} />
                </div>
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-semibold line-clamp-2 text-amber-900">{item.title}</CardTitle>
                <div className="text-sm text-amber-700 font-medium">{item.date}</div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">{item.excerpt}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-800 hover:bg-amber-50">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 gap-4">
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700 px-6 py-3">
            <Newspaper className="h-5 w-5" />
            View All Articles
          </Button>
          <Button variant="outline" className="gap-2 border-amber-300 text-amber-800 hover:bg-amber-50 px-6 py-3">
            <Globe className="h-5 w-5" />
            News Sources
          </Button>
        </div>
      </div>
    </section>
  );
};

// Badge component for indicating article type with agricultural theme
const Badge = ({ type }: { type: string }) => {
  let bgColor = "bg-amber-600 text-white";
  let icon = <Newspaper className="h-3 w-3 mr-1" />;
  
  if (type === "photo") {
    bgColor = "bg-blue-600 text-white";
    icon = <Image className="h-3 w-3 mr-1" />;
  } else if (type === "news") {
    bgColor = "bg-orange-600 text-white";
    icon = <Newspaper className="h-3 w-3 mr-1" />;
  } else if (type === "resource") {
    bgColor = "bg-green-600 text-white";
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
