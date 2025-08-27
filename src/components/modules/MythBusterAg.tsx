
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
          Agriguard At a glance
        </CardTitle>
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
                    <video 
                      controls
                      className="w-full h-full object-cover"
                      poster={featuredVideo.thumbnail_url ? `https://lhqwzirrqenvlsffpefk.supabase.co/storage/v1/object/public/mythbuster-videos/${featuredVideo.thumbnail_url}` : undefined}
                      onPlay={() => incrementViews(featuredVideo.id)}
                    >
                      <source 
                        src={`https://lhqwzirrqenvlsffpefk.supabase.co/storage/v1/object/public/mythbuster-videos/${featuredVideo.video_url}`}
                        type="video/mp4" 
                      />
                      Your browser does not support the video tag.
                    </video>
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
                       >
                         <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                            <video 
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            >
                              <source 
                                src={`https://lhqwzirrqenvlsffpefk.supabase.co/storage/v1/object/public/mythbuster-videos/${video.video_url}`}
                                type="video/mp4" 
                              />
                            </video>
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
