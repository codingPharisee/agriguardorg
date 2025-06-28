
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const aiStudiosApiKey = Deno.env.get('aistudios');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, prompt, title } = await req.json();
    
    if (!videoId || !prompt || !title) {
      throw new Error('VideoId, prompt, and title are required');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to generating
    await supabase
      .from('video_generations')
      .update({ status: 'generating' })
      .eq('id', videoId);

    console.log('Starting video generation for:', title);

    // Step 1: Generate script using OpenAI
    let script = '';
    if (openAIApiKey) {
      console.log('Generating script with OpenAI...');
      const scriptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system', 
              content: 'You are an agricultural education expert. Create engaging, accurate, and educational video scripts about agriculture, focusing on African contexts. Keep scripts to 2-3 minutes when spoken.'
            },
            {
              role: 'user',
              content: `Create an educational video script about: ${prompt}. Make it engaging and informative for farmers and agricultural students.`
            }
          ],
          max_tokens: 1000,
        }),
      });

      if (scriptResponse.ok) {
        const scriptData = await scriptResponse.json();
        script = scriptData.choices[0].message.content;
        console.log('Script generated successfully');
      } else {
        console.error('Failed to generate script');
      }
    }

    // Step 2: Generate video using AI Studios (if available)
    let videoUrl = null;
    let thumbnailUrl = null;

    if (aiStudiosApiKey && script) {
      console.log('Generating video with AI Studios...');
      
      // This is a placeholder for AI Studios integration
      // You would integrate with your preferred video generation service here
      // For now, we'll simulate the process
      
      // Simulate video generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Send the script to AI Studios API
      // 2. Wait for video generation
      // 3. Get the video URL
      
      videoUrl = `https://example.com/videos/${videoId}.mp4`; // Placeholder
      thumbnailUrl = `https://example.com/thumbnails/${videoId}.jpg`; // Placeholder
    }

    // Update the database with results
    const updateData: any = {
      script: script || 'Script generation failed',
      status: videoUrl ? 'completed' : 'failed',
    };

    if (videoUrl) {
      updateData.video_url = videoUrl;
      updateData.thumbnail_url = thumbnailUrl;
      updateData.duration = 180; // 3 minutes placeholder
    }

    await supabase
      .from('video_generations')
      .update(updateData)
      .eq('id', videoId);

    console.log('Video generation process completed');

    return new Response(JSON.stringify({ 
      success: true, 
      videoUrl,
      script: script.substring(0, 200) + '...'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in video generation:', error);
    
    // Update status to failed
    if (videoId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase
        .from('video_generations')
        .update({ status: 'failed' })
        .eq('id', videoId);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
