
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Image } from "lucide-react";

const newsItems = [
  {
    title: "GMO Crops Shown to Increase Yields by 22%",
    excerpt: "New research demonstrates that genetically modified crops are producing significantly higher yields while using fewer pesticides.",
    date: "May 8, 2025",
    imageUrl: "/placeholder.svg",
    type: "article"
  },
  {
    title: "Local Farmers Embrace New GMO Technologies",
    excerpt: "Community farming cooperatives report positive results after adopting drought-resistant GMO varieties.",
    date: "May 1, 2025",
    imageUrl: "/placeholder.svg",
    type: "news" 
  },
  {
    title: "Agricultural Innovation Summit Highlights",
    excerpt: "Scientists and farmers gathered to discuss the latest advancements in GMO research and implementation.",
    date: "April 22, 2025",
    imageUrl: "/placeholder.svg",
    type: "photo"
  },
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <div className="absolute top-2 right-2">
                  <Badge type={item.type} />
                </div>
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                <div className="text-xs text-gray-500">{item.date}</div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 text-sm">{item.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button className="gap-2">
            <Newspaper className="h-4 w-4" />
            View All Articles
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
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${bgColor}`}>
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default NewsAndPhotos;
