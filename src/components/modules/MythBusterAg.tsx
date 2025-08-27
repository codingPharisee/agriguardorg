
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Play, Volume2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/client';

interface VideoData {
  id: string;
  title: string;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
  views: number;
  category: string;
  is_featured: boolean;
}

const MythBusterAg = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('mythbuster_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('mythbuster_videos')
        .update({ views: videos.find(v => v.id === videoId)?.views + 1 || 1 })
        .eq('id', videoId);
      
      if (!error) {
        setVideos(prev => prev.map(v => 
          v.id === videoId ? { ...v, views: v.views + 1 } : v
        ));
      }
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };
  
  const togglePlay = (videoId?: string) => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying && videoId) {
      incrementViews(videoId);
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

  const featuredVideo = videos.find(v => v.is_featured) || videos[0];
  
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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No videos available yet. Admin can upload videos to display here.
          </div>
        ) : (
          <div className="space-y-4">
            {featuredVideo && (
              <div className="relative rounded-lg overflow-hidden border">
                <AspectRatio ratio={16/9}>
                  {featuredVideo.thumbnail_url ? (
                    <img 
                      src={featuredVideo.thumbnail_url} 
                      alt={featuredVideo.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
                      onClick={() => togglePlay(featuredVideo.id)}
                    >
                      {isPlaying ? 
                        <Volume2 className="h-6 w-6 text-white" /> : 
                        <Play className="h-6 w-6 text-white ml-1" />
                      }
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">{featuredVideo.title}</h3>
                      <Badge variant="outline" className="text-white border-white/50">
                        {featuredVideo.duration || "N/A"}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-1 bg-white/20" />
                  </div>
                </AspectRatio>
              </div>
            )}
            
            {videos.filter(v => !v.is_featured).length > 0 && (
              <div>
                <h3 className="font-medium mb-3">More Videos</h3>
                <ScrollArea className="h-[200px]">
                  <div className="grid gap-3">
                    {videos.filter(v => !v.is_featured).map((video) => (
                      <div 
                        key={video.id}
                        className="flex gap-3 p-2 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                        onClick={() => togglePlay(video.id)}
                      >
                        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                          {video.thumbnail_url ? (
                            <img src={video.thumbnail_url} alt={video.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Video className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {video.duration || "N/A"}
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MythBusterAg;
