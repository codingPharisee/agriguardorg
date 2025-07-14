import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('Received webhook:', webhookData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { projectId, status, downloadUrl, duration } = webhookData;

    if (!projectId) {
      console.error('No project ID in webhook');
      return new Response('Invalid webhook data', { status: 400 });
    }

    // Find the video record by AI Studios project ID
    const { data: videoRecord, error: findError } = await supabase
      .from('video_generations')
      .select('*')
      .eq('metadata->>ai_studios_project_id', projectId)
      .single();

    if (findError || !videoRecord) {
      console.error('Video record not found:', findError);
      return new Response('Video record not found', { status: 404 });
    }

    let updateData: any = {
      metadata: {
        ...videoRecord.metadata,
        webhook_status: status
      }
    };

    if (status === 'completed' && downloadUrl) {
      updateData.status = 'completed';
      updateData.video_url = downloadUrl;
      if (duration) {
        updateData.duration = duration;
      }
    } else if (status === 'failed') {
      updateData.status = 'failed';
      updateData.metadata = {
        ...videoRecord.metadata,
        error: 'Video generation failed',
        webhook_status: status
      };
    }

    // Update the video record
    const { error: updateError } = await supabase
      .from('video_generations')
      .update(updateData)
      .eq('id', videoRecord.id);

    if (updateError) {
      console.error('Failed to update video record:', updateError);
      return new Response('Failed to update video record', { status: 500 });
    }

    console.log(`Video ${videoRecord.id} updated to status: ${status}`);
    return new Response('Webhook processed successfully', { status: 200 });

  } catch (error) {
    console.error('Error in video-webhook function:', error);
    return new Response('Internal server error', { status: 500 });
  }
});