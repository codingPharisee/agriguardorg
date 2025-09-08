import React, { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from '@/integrations/supabase/client';

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
  views: number;
  category: string;
  is_featured: boolean;
}

const MythBusterAg = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
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

  const currentVideo = videos[currentVideoIndex];
  
  return (
    <div className="h-full">
      <div className="pb-4">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Agriguard at a glance
        </h3>
      </div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No videos available yet. Admin can upload videos to display here.
          </div>
        ) : currentVideo ? (
          <div className="space-y-4">
            {/* Main Video Player */}
            <div className="relative rounded-lg overflow-hidden">
              <AspectRatio ratio={16/9}>
                <video 
                  key={currentVideo.id}
                  controls
                  className="w-full h-full object-cover"
                  poster={currentVideo.thumbnail_url ? `https://lhqwzirrqenvlsffpefk.supabase.co/storage/v1/object/public/mythbuster-videos/${currentVideo.thumbnail_url}` : undefined}
                  onPlay={() => incrementViews(currentVideo.id)}
                >
                  <source 
                    src={`https://lhqwzirrqenvlsffpefk.supabase.co/storage/v1/object/public/mythbuster-videos/${currentVideo.video_url}`}
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              </AspectRatio>
            </div>

            {/* Video Grid Navigation */}
            {videos.length > 1 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {videos.map((video, index) => (
                  <div 
                    key={video.id}
                    className={`relative cursor-pointer rounded overflow-hidden border-2 transition-colors ${
                      index === currentVideoIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentVideoIndex(index)}
                  >
                    <AspectRatio ratio={16/9}>
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
                    </AspectRatio>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 text-black text-xs px-2 py-1 rounded font-medium">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MythBusterAg;