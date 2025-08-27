-- Insert a test video entry to test streaming functionality
INSERT INTO mythbuster_videos (
  title,
  description,
  video_url,
  category,
  is_featured,
  views
) VALUES (
  'Test Agricultural Video',
  'A test video to demonstrate the streaming functionality',
  'test-video.mp4',
  'Education',
  true,
  0
);