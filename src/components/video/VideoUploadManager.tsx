import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Video, 
  Play, 
  Trash2, 
  Download,
  FileVideo,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield
} from 'lucide-react';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { formatFileSize } from '@/lib/utils';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAuth } from '@/contexts/AuthContext';

interface VideoUploadManagerProps {
  onVideoUploaded?: (video: any) => void;
}

export const VideoUploadManager: React.FC<VideoUploadManagerProps> = ({ 
  onVideoUploaded 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { user } = useAuth();
  
  const { 
    uploadVideo, 
    fetchVideos, 
    deleteVideo, 
    uploadProgress, 
    videos, 
    isLoading,
    resetUploadProgress 
  } = useVideoUpload();

  // Show access denied if not admin
  if (!adminLoading && !isAdmin) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-muted-foreground text-center">
            Only administrators can access the video upload functionality.
          </p>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return;

    const video = await uploadVideo(selectedFile, title.trim(), description.trim() || undefined);
    
    if (video) {
      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh videos list
      await fetchVideos();
      
      // Notify parent component
      onVideoUploaded?.(video);
    }
  };

  const handleDelete = async (videoId: string) => {
    const success = await deleteVideo(videoId);
    if (success) {
      await fetchVideos();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileVideo className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Selection */}
          <div>
            <Label htmlFor="video-file">Select Video File</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <FileVideo className="h-4 w-4" />
                Choose File
              </Button>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Video className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <Badge variant="secondary">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/avi,video/mov,video/quicktime,video/webm"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress.status === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-gray-600">{uploadProgress.progress}%</span>
              </div>
              <Progress value={uploadProgress.progress} className="w-full" />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={
              !selectedFile || 
              !title.trim() || 
              uploadProgress.status === 'uploading'
            }
            className="w-full"
          >
            {uploadProgress.status === 'uploading' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>

          {uploadProgress.status === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Upload successful!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Videos List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              My Videos
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchVideos}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading videos...</span>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No videos uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                      )}
                       <div className="flex items-center gap-2 mt-2">
                         <Badge variant="secondary" className="text-xs">
                           {video.category}
                         </Badge>
                         <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                           <div className="flex items-center gap-1">
                             <CheckCircle className="h-3 w-3" />
                             Ready
                           </div>
                         </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(video.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                   <div className="flex items-center gap-2">
                     <>
                       <Button
                         variant="outline"
                         size="sm"
                         asChild
                       >
                         <a
                   href={video.video_url}
                   target="_blank"
                   rel="noopener noreferrer"
                           className="flex items-center gap-1"
                         >
                           <Play className="h-3 w-3" />
                           Play
                         </a>
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         asChild
                       >
                         <a
                           href={video.video_url}
                           download={video.title}
                           className="flex items-center gap-1"
                         >
                           <Download className="h-3 w-3" />
                           Download
                         </a>
                       </Button>
                     </>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleDelete(video.id)}
                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
                     >
                       <Trash2 className="h-3 w-3" />
                     </Button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};