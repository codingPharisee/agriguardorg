-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('mythbuster-videos', 'mythbuster-videos', true);

-- Create videos table
CREATE TABLE public.mythbuster_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  category TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.mythbuster_videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Videos are viewable by everyone" 
ON public.mythbuster_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create videos" 
ON public.mythbuster_videos 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update videos" 
ON public.mythbuster_videos 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete videos" 
ON public.mythbuster_videos 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mythbuster_videos_updated_at
BEFORE UPDATE ON public.mythbuster_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for videos
CREATE POLICY "Videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mythbuster-videos');

CREATE POLICY "Only admins can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mythbuster-videos' AND is_admin(auth.uid()));

CREATE POLICY "Only admins can update videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'mythbuster-videos' AND is_admin(auth.uid()));

CREATE POLICY "Only admins can delete videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'mythbuster-videos' AND is_admin(auth.uid()));