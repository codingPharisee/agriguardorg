import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice = 'Rachel' } = await req.json()
    
    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for text:', text.substring(0, 50) + '...')

    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    // Use Rachel voice ID (good for educational content)
    const voiceId = 'EXAVITQu4vr4xnSDxMaL' // Rachel

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs API error:', error)
      throw new Error(`ElevenLabs API error: ${error}`)
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )

    console.log('Speech generation completed')

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})