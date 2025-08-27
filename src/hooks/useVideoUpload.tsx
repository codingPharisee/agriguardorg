import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  category: string;
  duration?: string;
  is_featured: boolean;
  created_by: string;
  created_at: string;
  thumbnail_url?: string;
  views?: number;
}

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

export const useVideoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
  });
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uploadVideo = async (
    file: File,
    title: string,
    description?: string
  ): Promise<Video | null> => {
    try {
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Validate file
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Only video files (MP4, AVI, MOV, WebM) are allowed.',
          variant: 'destructive',
        });
        setUploadProgress({ progress: 0, status: 'error' });
        return null;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 100MB.',
          variant: 'destructive',
        });
        setUploadProgress({ progress: 0, status: 'error' });
        return null;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (description) {
        formData.append('description', description);
      }

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to upload videos.',
          variant: 'destructive',
        });
        setUploadProgress({ progress: 0, status: 'error' });
        return null;
      }

      // Upload using fetch with progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress({ progress, status: 'uploading' });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploadProgress({ progress: 100, status: 'success' });
            toast({
              title: 'Upload successful',
              description: 'Your video has been uploaded successfully.',
            });
            resolve(response.video);
          } else {
            const errorResponse = JSON.parse(xhr.responseText);
            setUploadProgress({ progress: 0, status: 'error' });
            toast({
              title: 'Upload failed',
              description: errorResponse.error || 'Failed to upload video.',
              variant: 'destructive',
            });
            reject(new Error(errorResponse.error));
          }
        });

        xhr.addEventListener('error', () => {
          setUploadProgress({ progress: 0, status: 'error' });
          toast({
            title: 'Upload failed',
            description: 'Network error occurred during upload.',
            variant: 'destructive',
          });
          reject(new Error('Network error'));
        });

        xhr.open('POST', 'https://lhqwzirrqenvlsffpefk.supabase.co/functions/v1/video-upload');
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        xhr.setRequestHeader('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocXd6aXJycWVudmxzZmZwZWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDAzNDUsImV4cCI6MjA2MjcxNjM0NX0.5frhpcXPCpOwevfwroPgIYRT1TKl_G-QDckCmYHIgns');
        xhr.send(formData);
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({ progress: 0, status: 'error' });
      toast({
        title: 'Upload failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const fetchVideos = async (): Promise<Video[]> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('video-upload', {
        method: 'GET',
      });

      if (error) throw error;

      setVideos(data.videos);
      return data.videos;
    } catch (error) {
      console.error('Fetch videos error:', error);
      toast({
        title: 'Failed to fetch videos',
        description: 'Could not load your videos.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (videoId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('video-upload', {
        method: 'DELETE',
        body: new URLSearchParams({ id: videoId }),
      });

      if (error) throw error;

      setVideos(prev => prev.filter(video => video.id !== videoId));
      toast({
        title: 'Video deleted',
        description: 'Your video has been deleted successfully.',
      });
      return true;
    } catch (error) {
      console.error('Delete video error:', error);
      toast({
        title: 'Delete failed',
        description: 'Could not delete the video.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const resetUploadProgress = () => {
    setUploadProgress({ progress: 0, status: 'idle' });
  };

  return {
    uploadVideo,
    fetchVideos,
    deleteVideo,
    uploadProgress,
    videos,
    isLoading,
    resetUploadProgress,
  };
};