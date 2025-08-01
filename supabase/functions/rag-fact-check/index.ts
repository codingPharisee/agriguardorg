
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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
    const { query, language = 'auto' } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing fact-check query:', query);

    // Step 1: Try to get relevant documents from the database
    let relevantDocuments = [];
    
    try {
      // First, try to get documents using similarity search
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('title, content, source')
        .limit(5);

      if (!docError && documents && documents.length > 0) {
        console.log(`Found ${documents.length} documents in database`);
        
        // Simple keyword matching for now (can be improved with embeddings later)
        const queryLower = query.toLowerCase();
        relevantDocuments = documents.filter(doc => 
          doc.content.toLowerCase().includes(queryLower) ||
          doc.title.toLowerCase().includes(queryLower) ||
          queryLower.split(' ').some(word => 
            word.length > 3 && (
              doc.content.toLowerCase().includes(word) ||
              doc.title.toLowerCase().includes(word)
            )
          )
        );
        
        console.log(`Found ${relevantDocuments.length} relevant documents`);
      } else {
        console.log('No documents found in database or error occurred:', docError);
      }
    } catch (error) {
      console.log('Error fetching documents:', error);
    }

    // Step 2: Prepare context for OpenAI
    let contextInfo = '';
    if (relevantDocuments.length > 0) {
      contextInfo = 'Based on the following agricultural documents:\n\n';
      relevantDocuments.forEach((doc, index) => {
        contextInfo += `Document ${index + 1}: ${doc.title}\n`;
        contextInfo += `Source: ${doc.source || 'Internal database'}\n`;
        contextInfo += `Content: ${doc.content.substring(0, 500)}...\n\n`;
      });
      contextInfo += 'Please analyze the claim using this information combined with your knowledge.\n\n';
    } else {
      contextInfo = 'No specific documents found in the database. Please use your general knowledge about African agriculture.\n\n';
    }

    // Language mapping for response instructions
    const languageInstructions = {
      'auto': 'Respond in the same language as the user\'s query. If the query is in English, respond in English. If in Swahili, respond in Swahili, etc.',
      'en': 'Respond in English.',
      'sw': 'Respond in Kiswahili (Swahili). Translate all your response including the source field.',
      'am': 'Respond in Amharic (አማርኛ). Translate all your response including the source field.',
      'ha': 'Respond in Hausa. Translate all your response including the source field.',
      'yo': 'Respond in Yoruba. Translate all your response including the source field.',
      'ig': 'Respond in Igbo. Translate all your response including the source field.',
      'zu': 'Respond in Zulu. Translate all your response including the source field.',
      'xh': 'Respond in Xhosa. Translate all your response including the source field.',
      'af': 'Respond in Afrikaans. Translate all your response including the source field.',
      'fr': 'Respond in French. Translate all your response including the source field.',
      'ar': 'Respond in Arabic. Translate all your response including the source field.',
      'pt': 'Respond in Portuguese. Translate all your response including the source field.'
    };

    const languageInstruction = languageInstructions[language] || languageInstructions['auto'];

    // Step 3: Call OpenAI for fact-checking
    const systemPrompt = `You are an expert agricultural fact-checker specializing in African farming practices. 
    
    LANGUAGE INSTRUCTION: ${languageInstruction}
    
    CRITICAL: Provide detailed, comprehensive responses that help users properly understand the topic.
    
    ${contextInfo}
    
    For each claim, provide:
    1. A clear assessment (true, false, or mixed/nuanced)
    2. A detailed, informative explanation that includes:
       - Specific research studies or experiments conducted
       - Names of research institutions and scientists involved
       - Statistical data and findings when available
       - Practical implications for farmers
       - Historical context or timeline of developments
       - Regional variations or considerations for African contexts
    3. Multiple credible source references with specific study names or publication details
    
    Focus on African agricultural contexts and cite reputable organizations like CGIAR centers (IITA, ICRISAT, etc.), IFPRI, African Development Bank, national agricultural research institutes, peer-reviewed journals, and field studies.
    
    Make the explanation educational and comprehensive so users can fully understand the science and evidence behind the assessment.
    
    Respond in JSON format with:
    {
      "isTrue": true/false/null (null for nuanced cases),
      "explanation": "detailed educational explanation including research, experiments, and evidence in the requested language",
      "source": "comprehensive source citations with specific studies and institutions in the requested language"
    }`;

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
          { role: 'user', content: `Please fact-check this agricultural claim: "${query}"` }
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Step 4: Parse the JSON response
    let factCheckResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        factCheckResult = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse the response manually
        const lines = aiResponse.split('\n');
        factCheckResult = {
          isTrue: null,
          explanation: aiResponse,
          source: relevantDocuments.length > 0 
            ? `Based on ${relevantDocuments.length} agricultural documents and expert knowledge`
            : 'Expert agricultural knowledge and scientific literature'
        };
      }
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback:', parseError);
      factCheckResult = {
        isTrue: null,
        explanation: aiResponse,
        source: relevantDocuments.length > 0 
          ? `Analysis based on ${relevantDocuments.length} agricultural documents`
          : 'Agricultural expert analysis'
      };
    }

    // Ensure the response has the expected structure
    if (!factCheckResult.explanation) {
      factCheckResult.explanation = aiResponse;
    }
    if (!factCheckResult.source) {
      factCheckResult.source = 'Agricultural expert analysis';
    }

    console.log('Final fact-check result:', factCheckResult);

    return new Response(JSON.stringify(factCheckResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in rag-fact-check function:', error);
    
    // Return a user-friendly error response
    const errorResponse = {
      isTrue: null,
      explanation: `I apologize, but I'm currently unable to fact-check this claim due to a technical issue: ${error.message}. Please try again later or contact support if the problem persists.`,
      source: 'System Error'
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Return 200 so the UI can handle the error gracefully
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
