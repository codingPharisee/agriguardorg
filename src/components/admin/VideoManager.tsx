
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Plus, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface VideoGeneration {
  id: string;
  title: string;
  prompt: string;
  script?: string;
  video_url?: string;
  thumbnail_url?: string;
  status: string;
  category?: string;
  created_at: string;
}

interface VideoManagerProps {
  adminRole: string | null;
}

const VideoManager: React.FC<VideoManagerProps> = ({ adminRole }) => {
  const [videos, setVideos] = useState<VideoGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    category: ""
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('video_generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async () => {
    if (!formData.title || !formData.prompt) {
      toast({
        title: "Error",
        description: "Title and prompt are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('video_generations')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setGeneratingVideo(data.id);
      
      // Call the video generation edge function
      const { error: genError } = await supabase.functions.invoke('generate-video', {
        body: { videoId: data.id, prompt: formData.prompt, title: formData.title }
      });

      if (genError) {
        console.error('Video generation error:', genError);
        toast({
          title: "Warning",
          description: "Video generation started but may have issues. Check the status.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Video generation started. This may take several minutes.",
        });
      }

      setIsCreateDialogOpen(false);
      setFormData({ title: "", prompt: "", category: "" });
      fetchVideos();
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Error",
        description: "Failed to create video",
        variant: "destructive",
      });
    } finally {
      setGeneratingVideo(null);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('video_generations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Generation Management
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Generate Educational Video</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Video title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Describe what the video should teach about (e.g., 'Explain the benefits and safety of GMO crops in African agriculture')"
                    value={formData.prompt}
                    onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                    rows={4}
                  />
                  <Input
                    placeholder="Category (e.g., GMO, Pesticides, Climate Change)"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                  <Button 
                    onClick={handleCreateVideo} 
                    className="w-full"
                    disabled={generatingVideo !== null}
                  >
                    {generatingVideo ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Starting Generation...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Video generation typically takes 5-10 minutes. You'll be notified when it's complete.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No videos generated yet</div>
            ) : (
              videos.map((video) => (
                <Card key={video.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{video.title}</h3>
                          <Badge className={getStatusColor(video.status)}>
                            {video.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{video.prompt}</p>
                        {video.category && (
                          <Badge variant="outline" className="mb-2">{video.category}</Badge>
                        )}
                        <p className="text-xs text-gray-400">
                          Created: {new Date(video.created_at).toLocaleDateString()}
                        </p>
                        {video.video_url && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm" asChild>
                              <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                                <Play className="h-4 w-4 mr-2" />
                                Watch Video
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoManager;
