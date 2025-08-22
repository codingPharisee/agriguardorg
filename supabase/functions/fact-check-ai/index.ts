
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'auto' } = await req.json();

    // Language mapping for response instructions
    const languageInstructions = {
      'auto': 'Respond in the same language as the user\'s query. If the query is in English, respond in English. If in Swahili, respond in Swahili, etc.',
      'en': 'Respond in English.',
      'sw': 'Respond in Kiswahili (Swahili).',
      'am': 'Respond in Amharic (አማርኛ).',
      'ha': 'Respond in Hausa.',
      'yo': 'Respond in Yoruba.',
      'ig': 'Respond in Igbo.',
      'zu': 'Respond in Zulu.',
      'xh': 'Respond in Xhosa.',
      'af': 'Respond in Afrikaans.',
      'fr': 'Respond in French.',
      'ar': 'Respond in Arabic.',
      'pt': 'Respond in Portuguese.'
    };

    const languageInstruction = languageInstructions[language] || languageInstructions['auto'];

    const systemPrompt = `You are an expert agricultural fact-checker focused on African farming practices and contexts. 

LANGUAGE INSTRUCTION: ${languageInstruction}

Your responses should be:
1. Concise but informative (3-4 sentences maximum) in the requested language
2. Based on key evidence from African agricultural research institutions 
3. Include 1-2 specific research findings or statistics
4. Provide one credible African agricultural source

Focus on the most important facts about African agricultural contexts. Be precise and educational but brief.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Fact-check this agricultural claim: ${query}` }
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the response to determine if claim is supported
    const isSupported = result.toLowerCase().includes('claim is supported by evidence');
    const isNotSupported = result.toLowerCase().includes('claim is not supported by evidence');

    return new Response(JSON.stringify({
      isTrue: isSupported ? true : isNotSupported ? false : null,
      explanation: result,
      source: "AI analysis based on African agricultural research"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fact-check-ai function:', error);
    return new Response(JSON.stringify({
      isTrue: null,
      explanation: "I apologize, but I'm currently experiencing technical issues and cannot fact-check this claim right now. Please try again later.",
      source: "System Error"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
