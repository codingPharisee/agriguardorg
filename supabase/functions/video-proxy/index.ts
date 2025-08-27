import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const videoPath = url.searchParams.get('path');
    
    if (!videoPath) {
      return new Response(
        JSON.stringify({ error: 'Video path parameter is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the video from storage
    const { data, error } = await supabase.storage
      .from('mythbuster-videos')
      .download(videoPath);

    if (error) {
      console.error('Error downloading video:', error);
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Handle range requests for video streaming
    const range = req.headers.get('range');
    const videoBuffer = await data.arrayBuffer();
    const videoSize = videoBuffer.byteLength;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunksize = (end - start) + 1;
      const chunk = videoBuffer.slice(start, end + 1);

      return new Response(chunk, {
        status: 206,
        headers: {
          ...corsHeaders,
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }

    // Return full video
    return new Response(videoBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'video/mp4',
        'Content-Length': videoSize.toString(),
        'Accept-Ranges': 'bytes',
      },
    });

  } catch (error) {
    console.error('Error in video-proxy function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})