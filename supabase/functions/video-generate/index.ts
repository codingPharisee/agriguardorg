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
    const { title, prompt, script, category, avatar_id } = await req.json();

    if (!title || !script) {
      return new Response(
        JSON.stringify({ error: 'Title and script are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get AI Studios API key
    const aiStudiosKey = Deno.env.get('aistudios');
    if (!aiStudiosKey) {
      console.error('AI Studios API key not found in environment');
      return new Response(
        JSON.stringify({ error: 'AI Studios API key not configured. Please add the aistudios secret.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Starting video generation for:', title);

    // Create video generation record in database
    const { data: videoRecord, error: dbError } = await supabase
      .from('video_generations')
      .insert({
        title,
        prompt: prompt || '',
        script,
        category: category || 'general',
        status: 'pending',
        metadata: { avatar_id }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to create video record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Call AI Studios API
    const aiStudiosResponse = await fetch('https://aistudios.com/api/odin/v3/editor/project', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiStudiosKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenes: [
          {
            background: {
              type: 'color',
              value: '#ffffff'
            },
            watermark: false,
            clips: [
              {
                layer: 1,
                top: 146.74,
                left: 630.2,
                type: 'aiModel',
                detail: {
                  ai: {
                    ai_name: avatar_id || 'M000045058',
                    emotion: 'BG00002320',
                    language: 'en',
                    pace: 1.0,
                    pitch: 1.0,
                    volume: 100
                  },
                  script: {
                    org: script,
                    tts: null
                  }
                }
              }
            ]
          }
        ],
        webhookUrl: `${supabaseUrl}/functions/v1/video-webhook`,
        isExport: true
      }),
    });

    if (!aiStudiosResponse.ok) {
      const responseText = await aiStudiosResponse.text();
      console.error('AI Studios API error - Status:', aiStudiosResponse.status);
      console.error('AI Studios API error - Response:', responseText);
      
      let errorMessage = 'AI Studios API error';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Response is not JSON, likely HTML error page
        if (responseText.includes('<!DOCTYPE')) {
          errorMessage = 'Invalid AI Studios API endpoint or authentication failed';
        } else {
          errorMessage = responseText.slice(0, 200); // First 200 chars of error
        }
      }
      
      // Update database with error status
      await supabase
        .from('video_generations')
        .update({ 
          status: 'failed',
          metadata: { 
            ...videoRecord.metadata,
            error: errorMessage
          }
        })
        .eq('id', videoRecord.id);

      return new Response(
        JSON.stringify({ error: 'Failed to generate video', details: errorMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const aiStudiosData = await aiStudiosResponse.json();
    console.log('AI Studios response:', aiStudiosData);

    // Update database with AI Studios project ID
    const { error: updateError } = await supabase
      .from('video_generations')
      .update({ 
        status: 'processing',
        metadata: { 
          ...videoRecord.metadata,
          ai_studios_project_id: aiStudiosData.data.projectId,
          ai_studios_project_key: aiStudiosData.data.key
        }
      })
      .eq('id', videoRecord.id);

    if (updateError) {
      console.error('Failed to update video record:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        video_id: videoRecord.id,
        ai_studios_project_id: aiStudiosData.data.projectId,
        status: 'processing'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in video-generate function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});