-- Create storage policies for video uploads
-- Policy for viewing videos (public access since bucket is public)
CREATE POLICY "Public access for videos" ON storage.objects
FOR SELECT USING (bucket_id = 'mythbuster-videos');

-- Policy for uploading videos (authenticated users only)
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'mythbuster-videos' AND 
  auth.role() = 'authenticated'
);

-- Policy for updating videos (users can update their own videos)
CREATE POLICY "Users can update their own videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'mythbuster-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'mythbuster-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for deleting videos (users can delete their own videos)
CREATE POLICY "Users can delete their own videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'mythbuster-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a table to track video metadata
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  duration REAL,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  thumbnail_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS policies for videos table
CREATE POLICY "Users can view all videos" ON public.videos
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own videos" ON public.videos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" ON public.videos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" ON public.videos
FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();