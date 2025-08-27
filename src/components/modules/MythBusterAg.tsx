
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
  description?: string;
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

    // Set up real-time subscription for new videos
    const channel = supabase
      .channel('mythbuster_videos_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mythbuster_videos'
        },
        (payload) => {
          const newVideo = payload.new as VideoData;
          // Only add if it's not a user upload
          if (newVideo.category !== 'user-upload') {
            setVideos(prev => [newVideo, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mythbuster_videos'
        },
        (payload) => {
          const updatedVideo = payload.new as VideoData;
          if (updatedVideo.category !== 'user-upload') {
            setVideos(prev => prev.map(video => 
              video.id === updatedVideo.id ? updatedVideo : video
            ));
          } else {
            // Remove if it became a user upload
            setVideos(prev => prev.filter(video => video.id !== updatedVideo.id));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'mythbuster_videos'
        },
        (payload) => {
          const deletedVideo = payload.old as VideoData;
          setVideos(prev => prev.filter(video => video.id !== deletedVideo.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('mythbuster_videos')
        .select('*')
        .neq('category', 'user-upload')
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
                   {featuredVideo.video_url.startsWith('sample-') ? (
                     // Demo content placeholder
                     <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex flex-col items-center justify-center text-center p-6">
                       <Video className="h-16 w-16 mb-4 text-primary" />
                       <h3 className="text-lg font-semibold mb-2">{featuredVideo.title}</h3>
                       <p className="text-sm text-muted-foreground mb-4">{featuredVideo.description}</p>
                       <Badge variant="outline" className="mb-2">
                         Demo Content - {featuredVideo.duration}
                       </Badge>
                       <p className="text-xs text-muted-foreground">
                         This is sample educational content. Upload real videos as admin to replace.
                       </p>
                     </div>
                   ) : (
                     // Actual video content
                     <video 
                       controls
                       className="w-full h-full object-cover"
                       poster={featuredVideo.thumbnail_url || undefined}
                       onPlay={() => incrementViews(featuredVideo.id)}
                       onError={(e) => {
                         console.error('Video load error for:', featuredVideo.video_url);
                       }}
                     >
                       <source 
                         src={`https://lhqwzirrqenvlsffpefk.supabase.co/functions/v1/video-proxy?path=${encodeURIComponent(featuredVideo.video_url)}`}
                         type="video/mp4" 
                       />
                       Your browser does not support the video tag.
                     </video>
                   )}
                   {!featuredVideo.video_url.startsWith('sample-') && (
                     <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                       <div className="flex items-center justify-between mb-1">
                         <h3 className="font-medium text-white">{featuredVideo.title}</h3>
                         <Badge variant="outline" className="text-white border-white/50">
                           {featuredVideo.duration || "N/A"}
                         </Badge>
                       </div>
                       <Progress value={progress} className="h-1 bg-white/20" />
                     </div>
                   )}
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
                          <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                            {video.video_url.startsWith('sample-') ? (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                                <Video className="h-6 w-6 text-primary" />
                              </div>
                            ) : (
                              <video 
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              >
                                <source 
                                  src={`https://lhqwzirrqenvlsffpefk.supabase.co/functions/v1/video-proxy?path=${encodeURIComponent(video.video_url)}`}
                                  type="video/mp4" 
                                />
                              </video>
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
                              {video.video_url.startsWith('sample-') && (
                                <span className="text-orange-600 text-xs">Demo</span>
                              )}
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
