import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoUpload from '@/components/admin/VideoUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Video, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    checkAdminStatus();
    fetchVideos();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('mythbuster_videos')
        .delete()
        .eq('id', videoId);

      if (error) {
        throw error;
      }

      toast({
        title: "Video Deleted",
        description: "The video has been successfully deleted.",
      });

      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the video.",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (videoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('mythbuster_videos')
        .update({ is_featured: !currentStatus })
        .eq('id', videoId);

      if (error) {
        throw error;
      }

      toast({
        title: "Video Updated",
        description: `Video ${!currentStatus ? 'set as' : 'removed from'} featured.`,
      });

      fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update the video.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="h-6 w-6" />
              <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>
            
            <Tabs defaultValue="videos" className="space-y-6">
              <TabsList>
                <TabsTrigger value="videos">Video Management</TabsTrigger>
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <VideoUpload />
              </TabsContent>
              
              <TabsContent value="videos">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Manage Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {videos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No videos uploaded yet. Use the Upload Video tab to add videos.
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {videos.map((video: any) => (
                          <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              {video.thumbnail_url && (
                                <img 
                                  src={video.thumbnail_url} 
                                  alt={video.title}
                                  className="w-16 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <h3 className="font-medium">{video.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {video.category} • {video.views} views
                                  {video.is_featured && ' • Featured'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={video.is_featured ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleFeatured(video.id, video.is_featured)}
                              >
                                {video.is_featured ? 'Remove Featured' : 'Set Featured'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteVideo(video.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;