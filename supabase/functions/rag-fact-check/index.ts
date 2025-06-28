
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

    console.log('Processing enhanced RAG fact-check query:', query);

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
      match_threshold: 0.6,
      match_count: 5
    });

    if (searchError) {
      console.error('Error searching documents:', searchError);
      // Fallback to keyword search if vector search fails
      const { data: fallbackDocs } = await supabase
        .from('documents')
        .select('title, content, source, document_type')
        .textSearch('content', query.split(' ').join(' | '), { config: 'english' })
        .limit(5);
      
      similarDocs = fallbackDocs || [];
    } else {
      similarDocs = vectorDocs || [];
    }

    // Step 3: Prepare context from retrieved documents
    const documentContext = similarDocs.length > 0 ? 
      similarDocs.map((doc: any) => 
        `Document: ${doc.title}\nContent: ${doc.content}\nSource: ${doc.source || 'Unknown'}\nType: ${doc.document_type || 'Unknown'}\n---`
      ).join('\n') : 'No specific documents found in the database.';

    // Step 4: Enhanced fact-check response using OpenAI with both document context and its own knowledge
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
            content: `You are an expert agricultural fact-checker with deep knowledge of African agriculture. You have access to both a custom document database and your training data.

Your task is to fact-check agricultural claims by analyzing:
1. The provided documents from the custom database (if any)
2. Your own knowledge of agricultural science and African farming

Response format (be precise):
- **Verdict**: [TRUE/FALSE/PARTIALLY TRUE/NEEDS CONTEXT]
- **Confidence**: [HIGH/MEDIUM/LOW]
- **Explanation**: Provide a clear, detailed explanation that references both the custom documents (if relevant) and general agricultural knowledge
- **Document Evidence**: If documents are provided, specifically mention what they say
- **Additional Context**: Add relevant information from your training data
- **Sources**: Distinguish between custom documents and general agricultural knowledge

Custom documents from database:
${documentContext}

Guidelines:
- Be thorough but concise
- Cross-reference document evidence with your knowledge
- If documents contradict your knowledge, explain the discrepancy
- Provide actionable insights for African farmers when possible
- If no documents are available, rely on your agricultural knowledge but mention this limitation`
          },
          {
            role: 'user',
            content: `Please fact-check this agricultural claim or question: "${query}"`
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!factCheckResponse.ok) {
      throw new Error('Failed to generate enhanced fact-check response');
    }

    const factCheckData = await factCheckResponse.json();
    const analysis = factCheckData.choices[0].message.content;

    console.log('Enhanced fact-check analysis:', analysis.substring(0, 200) + '...');

    // Step 5: Parse the structured response
    const parseVerdict = (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes('verdict**: true') || lower.includes('verdict: true')) return true;
      if (lower.includes('verdict**: false') || lower.includes('verdict: false')) return false;
      if (lower.includes('partially true') || lower.includes('needs context')) return null;
      return null;
    };

    const parseConfidence = (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes('confidence**: high') || lower.includes('confidence: high')) return 'high';
      if (lower.includes('confidence**: low') || lower.includes('confidence: low')) return 'low';
      return 'medium';
    };

    const isTrue = parseVerdict(analysis);
    const confidence = parseConfidence(analysis);

    // Determine sources - combine document sources with OpenAI knowledge indication
    const documentSources = similarDocs.length > 0 ? 
      similarDocs.map((doc: any) => doc.source).filter(Boolean).join('; ') : '';
    
    const sources = documentSources ? 
      `Custom Documents: ${documentSources}; Enhanced with OpenAI Agricultural Knowledge` : 
      'OpenAI Agricultural Knowledge (No custom documents found)';

    console.log('Enhanced RAG fact-check completed successfully');

    return new Response(JSON.stringify({
      isTrue,
      explanation: analysis,
      source: sources,
      retrievedDocs: similarDocs.length,
      confidence,
      hasCustomDocs: similarDocs.length > 0,
      enhancedWithAI: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced RAG fact-check:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      enhancedWithAI: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
