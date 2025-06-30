
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

    let similarDocs = [];
    let hasCustomDocs = false;
    let retrievedDocCount = 0;

    try {
      // Step 1: Try to generate embedding for the query (only if we have documents)
      const { data: docCount } = await supabase
        .from('documents')
        .select('id', { count: 'exact', head: true });
      
      if (docCount && docCount > 0) {
        console.log(`Found ${docCount} documents in database, attempting vector search...`);
        
        try {
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

          if (embeddingResponse.ok) {
            const embeddingData = await embeddingResponse.json();
            const queryEmbedding = embeddingData.data[0].embedding;

            // Step 2: Search for similar documents using vector similarity
            const { data: vectorDocs, error: searchError } = await supabase.rpc('match_documents', {
              query_embedding: queryEmbedding,
              match_threshold: 0.6,
              match_count: 5
            });

            if (!searchError && vectorDocs && vectorDocs.length > 0) {
              similarDocs = vectorDocs;
              hasCustomDocs = true;
              retrievedDocCount = vectorDocs.length;
              console.log(`Vector search successful: found ${retrievedDocCount} relevant documents`);
            } else {
              console.log('Vector search failed or no results, trying keyword search...');
              // Fallback to keyword search
              const { data: fallbackDocs } = await supabase
                .from('documents')
                .select('title, content, source, document_type')
                .textSearch('content', query.split(' ').join(' | '), { config: 'english' })
                .limit(5);
              
              if (fallbackDocs && fallbackDocs.length > 0) {
                similarDocs = fallbackDocs;
                hasCustomDocs = true;
                retrievedDocCount = fallbackDocs.length;
                console.log(`Keyword search successful: found ${retrievedDocCount} relevant documents`);
              }
            }
          } else {
            console.log('Failed to generate embeddings, proceeding without document retrieval');
          }
        } catch (embeddingError) {
          console.log('Embedding generation failed:', embeddingError);
          // Try keyword search as fallback
          const { data: fallbackDocs } = await supabase
            .from('documents')
            .select('title, content, source, document_type')
            .textSearch('content', query.split(' ').join(' | '), { config: 'english' })
            .limit(5);
          
          if (fallbackDocs && fallbackDocs.length > 0) {
            similarDocs = fallbackDocs;
            hasCustomDocs = true;
            retrievedDocCount = fallbackDocs.length;
            console.log(`Fallback keyword search successful: found ${retrievedDocCount} relevant documents`);
          }
        }
      } else {
        console.log('No documents found in database, proceeding with OpenAI-only analysis');
      }
    } catch (error) {
      console.log('Document retrieval failed, proceeding with OpenAI-only analysis:', error);
    }

    // Step 3: Prepare context from retrieved documents (if any)
    const documentContext = hasCustomDocs ? 
      similarDocs.map((doc: any) => 
        `Document: ${doc.title}\nContent: ${doc.content}\nSource: ${doc.source || 'Unknown'}\nType: ${doc.document_type || 'Unknown'}\n---`
      ).join('\n') : 'No custom documents found in the database.';

    // Step 4: Create system prompt based on whether we have documents or not
    const systemPrompt = hasCustomDocs ? 
      `You are an expert agricultural fact-checker with deep knowledge of African agriculture. You have access to both a custom document database and your training data.

Your task is to fact-check agricultural claims by analyzing:
1. The provided documents from the custom database
2. Your own knowledge of agricultural science and African farming

Response format (be precise):
- **Verdict**: [TRUE/FALSE/PARTIALLY TRUE/NEEDS CONTEXT]
- **Confidence**: [HIGH/MEDIUM/LOW]
- **Explanation**: Provide a clear, detailed explanation that references both the custom documents and general agricultural knowledge
- **Document Evidence**: Specifically mention what the custom documents say and how they relate to the claim
- **Additional Context**: Add relevant information from your training data to supplement the document findings
- **Sources**: Distinguish between custom documents and general agricultural knowledge

Custom documents from database:
${documentContext}

Guidelines:
- Be thorough but concise
- Cross-reference document evidence with your knowledge
- If documents contradict your knowledge, explain the discrepancy
- Provide actionable insights for African farmers when possible
- Clearly indicate when information comes from documents vs. your training data` :
      
      `You are an expert agricultural fact-checker with deep knowledge of African agriculture. Since no custom documents were found in the database, you will rely entirely on your training data.

Your task is to fact-check agricultural claims using your knowledge of agricultural science and African farming practices.

Response format (be precise):
- **Verdict**: [TRUE/FALSE/PARTIALLY TRUE/NEEDS CONTEXT]
- **Confidence**: [HIGH/MEDIUM/LOW]
- **Explanation**: Provide a clear, detailed explanation based on your agricultural knowledge
- **Scientific Context**: Include relevant scientific evidence and studies when applicable
- **African Context**: Specifically address how this applies to African agricultural conditions
- **Sources**: Mention the type of knowledge/evidence your response is based on

Guidelines:
- Be thorough but concise
- Focus on scientific evidence and established agricultural practices
- Provide actionable insights for African farmers when possible
- Note any limitations in your knowledge or areas where local expertise would be valuable
- Clearly indicate that this analysis is based on general agricultural knowledge rather than specific uploaded documents`;

    // Step 5: Get fact-check response from OpenAI
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
            content: systemPrompt
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

    console.log('Enhanced fact-check analysis generated successfully');

    // Step 6: Parse the structured response
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

    // Step 7: Determine sources based on what was used
    const sources = hasCustomDocs ? 
      `Custom Documents (${retrievedDocCount} found) + OpenAI Agricultural Knowledge` : 
      'OpenAI Agricultural Knowledge (No custom documents available)';

    console.log(`Enhanced RAG fact-check completed successfully. Used custom docs: ${hasCustomDocs}, Retrieved: ${retrievedDocCount}`);

    return new Response(JSON.stringify({
      isTrue,
      explanation: analysis,
      source: sources,
      retrievedDocs: retrievedDocCount,
      confidence,
      hasCustomDocs,
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
