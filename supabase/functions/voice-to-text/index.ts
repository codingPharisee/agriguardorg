import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing audio transcription...', { audioLength: audio.length })

    // Decode base64 audio more safely
    let binaryAudio: Uint8Array;
    try {
      // Handle audio data that might have data URL prefix
      let cleanBase64 = audio;
      if (audio.includes(',')) {
        cleanBase64 = audio.split(',')[1];
      }
      
      binaryAudio = processBase64Chunks(cleanBase64);
      console.log('Audio processed successfully, size:', binaryAudio.length);
    } catch (decodeError) {
      console.error('Error decoding base64 audio:', decodeError);
      throw new Error('Invalid audio data format');
    }
    
    // Prepare form data with proper audio format
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm;codecs=opus' })
    formData.append('file', blob, 'recording.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'en') // Optional: specify language for better accuracy

    console.log('Sending to OpenAI Whisper API...')

    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      
      // Better error handling for different status codes
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI configuration.');
      } else if (response.status === 400) {
        throw new Error('Invalid audio format. Please try recording again.');
      } else {
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }
    }

    const result = await response.json()
    console.log('Transcription successful:', { text: result.text, textLength: result.text?.length })

    if (!result.text || result.text.trim().length === 0) {
      throw new Error('No speech detected in audio. Please speak clearly and try again.');
    }

    return new Response(
      JSON.stringify({ text: result.text.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice-to-text error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})