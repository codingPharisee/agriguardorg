
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Play, Volume2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockVideos = [
  {
    id: 1,
    title: "The Truth About GMOs and Health",
    thumbnail: "https://source.unsplash.com/random/800x600/?farming",
    length: "2:45",
    views: 1240,
    category: "GMOs",
    featured: true,
  },
  {
    id: 2,
    title: "Do Pesticides Kill All Bees?",
    thumbnail: "https://source.unsplash.com/random/800x600/?bees",
    length: "3:12",
    views: 982,
    category: "Pesticides",
    featured: false,
  },
  {
    id: 3,
    title: "Organic vs. Conventional: Yield Facts",
    thumbnail: "https://source.unsplash.com/random/800x600/?organic",
    length: "4:05",
    views: 742,
    category: "Farming Practices",
    featured: false,
  },
];

const MythBusterAg = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const featuredVideo = mockVideos.find(v => v.featured);
  
  return (
    <Card className="module-card">
      <CardHeader className="pb-2">
        <CardTitle className="module-header">
          <Video className="h-5 w-5" />
          MythBuster Ag
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-generated educational videos to debunk and "prebunk" agricultural myths
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <AspectRatio ratio={16/9}>
              <img 
                src={featuredVideo?.thumbnail} 
                alt={featuredVideo?.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
                  onClick={togglePlay}
                >
                  {isPlaying ? 
                    <Volume2 className="h-6 w-6 text-white" /> : 
                    <Play className="h-6 w-6 text-white ml-1" />
                  }
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-white">{featuredVideo?.title}</h3>
                  <Badge variant="outline" className="text-white border-white/50">
                    {featuredVideo?.length}
                  </Badge>
                </div>
                <Progress value={progress} className="h-1 bg-white/20" />
              </div>
            </AspectRatio>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">More Videos</h3>
            <ScrollArea className="h-[200px]">
              <div className="grid gap-3">
                {mockVideos.filter(v => !v.featured).map((video) => (
                  <div 
                    key={video.id}
                    className="flex gap-3 p-2 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="object-cover w-full h-full" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.length}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{video.views} views</span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {video.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MythBusterAg;
