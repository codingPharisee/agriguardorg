
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
1. Detailed and comprehensive to help users properly understand the topic
2. Based on evidence from African agricultural research institutions (AGRA, AATF, FARA, CGIAR centers in Africa, national agricultural research institutes)
3. Include specific research studies, experiments, and scientific findings
4. Provide statistical data, research methodologies, and practical implications
5. Mention specific scientists, institutions, and publication details when available
6. Explain the historical context and regional considerations for African farming
7. Cite multiple credible African agricultural sources with specific study names

Focus on African agricultural contexts, farming practices, crop varieties, climate conditions, and local food systems. Make your explanations educational and evidence-based so users can fully understand the science behind the assessment.`;

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
        max_tokens: 600,
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
