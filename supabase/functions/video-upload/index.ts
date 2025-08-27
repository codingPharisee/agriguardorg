import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoUploadRequest {
  fileName: string;
  fileSize: number;
  mimeType: string;
  title: string;
  description?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type');
      
      if (contentType?.includes('multipart/form-data')) {
        // Handle file upload
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string || null;

        if (!file) {
          return new Response(
            JSON.stringify({ error: 'No file provided' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/webm'];
        if (!allowedTypes.includes(file.type)) {
          return new Response(
            JSON.stringify({ error: 'Invalid file type. Only video files are allowed.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
          return new Response(
            JSON.stringify({ error: 'File size too large. Maximum 100MB allowed.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('mythbuster-videos')
          .upload(uniqueFileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return new Response(
            JSON.stringify({ error: 'Failed to upload file' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('mythbuster-videos')
          .getPublicUrl(uploadData.path);

        // Save video metadata to database (store file path for video-proxy)
        const { data: videoData, error: dbError } = await supabase
          .from('mythbuster_videos')
          .insert({
            title: title || file.name,
            description,
            video_url: uploadData.path, // Store file path for video-proxy
            category: 'user-upload',
            duration: null,
            created_by: user.id,
            is_featured: false
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          // Clean up uploaded file if database insert fails
          await supabase.storage
            .from('mythbuster-videos')
            .remove([uploadData.path]);
            
          return new Response(
            JSON.stringify({ error: 'Failed to save video metadata' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            video: {
              ...videoData,
              stream_url: `https://lhqwzirrqenvlsffpefk.supabase.co/functions/v1/video-proxy?path=${encodeURIComponent(uploadData.path)}`
            }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } else {
        // Handle JSON request for getting upload URL
        const body: VideoUploadRequest = await req.json();
        
        if (!body.fileName || !body.title) {
          return new Response(
            JSON.stringify({ error: 'fileName and title are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate unique filename
        const fileExtension = body.fileName.split('.').pop();
        const uniqueFileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

        // Create signed upload URL
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('mythbuster-videos')
          .createSignedUploadUrl(uniqueFileName);

        if (urlError) {
          console.error('Signed URL error:', urlError);
          return new Response(
            JSON.stringify({ error: 'Failed to create upload URL' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            uploadUrl: signedUrlData.signedUrl,
            filePath: uniqueFileName,
            token: signedUrlData.token
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (req.method === 'GET') {
      // Get user's videos
      const { data: videos, error: videosError } = await supabase
        .from('mythbuster_videos')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (videosError) {
        console.error('Database error:', videosError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch videos' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Videos already have video_url, no need to generate public URLs
      return new Response(
        JSON.stringify({ videos }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'DELETE') {
      // Delete video
      const url = new URL(req.url);
      const videoId = url.searchParams.get('id');
      
      if (!videoId) {
        return new Response(
          JSON.stringify({ error: 'Video ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get video data
      const { data: video, error: fetchError } = await supabase
        .from('mythbuster_videos')
        .select('video_url, created_by')
        .eq('id', videoId)
        .eq('created_by', user.id)
        .single();

      if (fetchError || !video) {
        return new Response(
          JSON.stringify({ error: 'Video not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Note: For mythbuster_videos, we don't delete from storage as video_url might be external

      // Delete from database
      const { error: dbError } = await supabase
        .from('mythbuster_videos')
        .delete()
        .eq('id', videoId)
        .eq('created_by', user.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to delete video' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});