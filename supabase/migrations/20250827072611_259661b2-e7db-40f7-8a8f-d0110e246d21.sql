-- Enable real-time for mythbuster_videos table
ALTER TABLE public.mythbuster_videos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mythbuster_videos;