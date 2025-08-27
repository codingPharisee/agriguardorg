import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Video } from 'lucide-react';

const VideoUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    isFeatured: false
  });

  const handleVideoUpload = async (file: File) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('mythbuster-videos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `thumbnail-${Math.random()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('mythbuster-videos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const form = e.currentTarget;
      const videoFile = (form.elements.namedItem('video') as HTMLInputElement)?.files?.[0];
      const thumbnailFile = (form.elements.namedItem('thumbnail') as HTMLInputElement)?.files?.[0];

      if (!videoFile) {
        throw new Error('Please select a video file');
      }

      if (!formData.title || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Upload video and thumbnail
      const [videoUrl, thumbnailUrl] = await Promise.all([
        handleVideoUpload(videoFile),
        thumbnailFile ? handleThumbnailUpload(thumbnailFile) : null
      ]);

      // Save to database
      const { error: dbError } = await supabase
        .from('mythbuster_videos')
        .insert({
          title: formData.title,
          description: formData.description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          duration: formData.duration,
          category: formData.category,
          is_featured: formData.isFeatured
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Video Uploaded",
        description: "The video has been successfully uploaded and is now available.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        duration: '',
        isFeatured: false
      });
      form.reset();

    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Upload MythBuster Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video File *</label>
            <Input
              name="video"
              type="file"
              accept="video/*"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
            <Input
              name="thumbnail"
              type="file"
              accept="image/*"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter video title"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter video description"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agricultural Biotechnology">Agricultural Biotechnology</SelectItem>
                <SelectItem value="Pesticides">Pesticides</SelectItem>
                <SelectItem value="Farming Practices">Farming Practices</SelectItem>
                <SelectItem value="Crop Protection">Crop Protection</SelectItem>
                <SelectItem value="Soil Management">Soil Management</SelectItem>
                <SelectItem value="Climate Change">Climate Change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 3:45"
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              disabled={isUploading}
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Set as featured video
            </label>
          </div>

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;