import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { topic, userScript, category, format } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Initialize Supabase client for RAG
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching relevant documents for topic:', topic);

    // Fetch relevant documents for fact-checking and context
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('title, content, source')
      .or(`title.ilike.%${topic}%,content.ilike.%${topic}%,category.ilike.%GMO%,category.ilike.%agriculture%`)
      .limit(5);

    if (docsError) {
      console.error('Error fetching documents:', docsError);
    }

    const documentContext = documents?.map(doc => 
      `Title: ${doc.title}\nContent: ${doc.content.substring(0, 500)}...\nSource: ${doc.source || 'Unknown'}`
    ).join('\n\n') || '';

    const formatInstructions = {
      'short': 'Create a concise 30-60 second script (approximately 100-150 words) suitable for social media.',
      'medium': 'Create a detailed 2-3 minute educational script (approximately 300-400 words) with clear explanations.',
      'long': 'Create a comprehensive 4-5 minute educational script (approximately 600-800 words) with detailed explanations and examples.'
    };

    const systemPrompt = `You are an expert agricultural educator specializing in GMO education. Your role is to create accurate, engaging, and educational video scripts about GMO topics.

Context from uploaded documents:
${documentContext}

Instructions:
- Use scientific facts and evidence-based information
- Address common misconceptions about GMOs
- Make complex topics accessible to general audiences
- Include specific examples and real-world applications
- Maintain an educational but engaging tone
- ${formatInstructions[format as keyof typeof formatInstructions] || formatInstructions.medium}
- Structure with clear introduction, main points, and conclusion
- Ensure all claims are factually accurate based on the provided context

Category focus: ${category || 'General GMO education'}`;

    const userPrompt = userScript 
      ? `Please enhance and fact-check this existing script about ${topic}:\n\n${userScript}\n\nImprove it while maintaining accuracy and educational value.`
      : `Create an educational video script about: ${topic}\n\nMake it informative, engaging, and scientifically accurate.`;

    console.log('Calling OpenAI for script generation/enhancement');

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate script', details: data.error?.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const enhancedScript = data.choices[0].message.content;

    // Fact-check the script against our documents
    console.log('Performing fact-check on generated script');
    
    const factCheckPrompt = `Based on the following scientific documents about GMO and agriculture, verify the accuracy of this script and flag any potential misinformation:

Documents:
${documentContext}

Script to verify:
${enhancedScript}

Respond with JSON in this format:
{
  "isAccurate": true/false,
  "concerns": ["list any factual concerns"],
  "suggestions": ["list any improvements"],
  "confidence": 0.0-1.0
}`;

    const factCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: factCheckPrompt }
        ],
        temperature: 0.1,
      }),
    });

    const factCheckData = await factCheckResponse.json();
    let factCheck = null;

    try {
      factCheck = JSON.parse(factCheckData.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse fact-check response:', e);
    }

    return new Response(
      JSON.stringify({ 
        script: enhancedScript,
        factCheck,
        documentsSources: documents?.map(doc => ({ title: doc.title, source: doc.source })) || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in script-enhance function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});