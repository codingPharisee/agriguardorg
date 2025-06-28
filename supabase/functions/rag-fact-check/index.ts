
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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
    const { query } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing RAG fact-check query:', query);

    // Step 1: Generate embedding for the query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate query embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Step 2: Search for similar documents using vector similarity
    let similarDocs;
    const { data: vectorDocs, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 3
    });

    if (searchError) {
      console.error('Error searching documents:', searchError);
      // Fallback to keyword search if vector search fails
      const { data: fallbackDocs } = await supabase
        .from('documents')
        .select('title, content, source, document_type')
        .textSearch('content', query.split(' ').join(' | '), { config: 'english' })
        .limit(3);
      
      similarDocs = fallbackDocs || [];
    } else {
      similarDocs = vectorDocs || [];
    }

    // Step 3: Prepare context from retrieved documents
    const context = similarDocs.map((doc: any) => 
      `Title: ${doc.title}\nContent: ${doc.content}\nSource: ${doc.source || 'Unknown'}\n---`
    ).join('\n');

    // Step 4: Generate fact-check response using GPT with retrieved context
    const factCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert agricultural fact-checker specializing in African agriculture. Based on the provided context from verified sources, analyze the user's query and provide a fact-check response.

Response format:
1. Determine if the claim is: true, false, or partially true/needs context
2. Provide a clear explanation based on the evidence
3. Include confidence level (high/medium/low)
4. Cite specific sources when possible

Context from verified agricultural sources:
${context}

If the context doesn't contain relevant information, say so and provide general guidance based on established agricultural science.`
          },
          {
            role: 'user',
            content: `Please fact-check this agricultural claim or question: "${query}"`
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!factCheckResponse.ok) {
      throw new Error('Failed to generate fact-check response');
    }

    const factCheckData = await factCheckResponse.json();
    const analysis = factCheckData.choices[0].message.content;

    // Parse the response to extract structured data
    const isTrue = analysis.toLowerCase().includes('true') && !analysis.toLowerCase().includes('false') ? true :
                   analysis.toLowerCase().includes('false') ? false : null;

    const sources = similarDocs.map((doc: any) => doc.source).filter(Boolean).join('; ') || 
                   'African Agricultural Research Databases';

    console.log('RAG fact-check completed successfully');

    return new Response(JSON.stringify({
      isTrue,
      explanation: analysis,
      source: sources,
      retrievedDocs: similarDocs.length,
      confidence: analysis.toLowerCase().includes('high confidence') ? 'high' : 
                 analysis.toLowerCase().includes('low confidence') ? 'low' : 'medium'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in RAG fact-check:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
