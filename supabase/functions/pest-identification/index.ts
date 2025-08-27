import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    
    if (!image) {
      throw new Error('No image data provided')
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing pest/disease identification...')

    // Use OpenAI Vision API for pest/disease identification
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert agricultural pathologist and entomologist specializing in African crops. 
            Analyze the provided image to identify any pests, diseases, or plant health issues.
            
            Provide your response in JSON format with:
            {
              "identified": true/false,
              "type": "pest" | "disease" | "nutrient_deficiency" | "healthy" | "unknown",
              "name": "specific name of the issue",
              "confidence": 0-100,
              "description": "brief description of the issue",
              "symptoms": ["list", "of", "visible", "symptoms"],
              "treatment": {
                "immediate": "immediate actions to take",
                "preventive": "preventive measures",
                "organic": "organic treatment options",
                "chemical": "chemical treatment if necessary"
              },
              "severity": "low" | "medium" | "high",
              "crop_affected": "crop type if identifiable"
            }
            
            Focus on common African agricultural pests and diseases. Be conservative with identification - if uncertain, indicate low confidence.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this image for any pests, diseases, or plant health issues:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    console.log('AI Response:', aiResponse)

    // Try to parse JSON response
    let analysisResult
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        // Fallback response
        analysisResult = {
          identified: false,
          type: "unknown",
          name: "Unable to identify",
          confidence: 0,
          description: aiResponse,
          symptoms: [],
          treatment: {
            immediate: "Consult with local agricultural extension services",
            preventive: "Maintain good crop hygiene and monitoring",
            organic: "Use organic pest management practices",
            chemical: "Seek professional advice before using chemicals"
          },
          severity: "unknown",
          crop_affected: "unknown"
        }
      }
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback:', parseError)
      analysisResult = {
        identified: false,
        type: "unknown",
        name: "Analysis incomplete",
        confidence: 0,
        description: aiResponse,
        symptoms: [],
        treatment: {
          immediate: "Monitor the plant closely",
          preventive: "Maintain good agricultural practices",
          organic: "Consider organic treatments",
          chemical: "Consult agricultural experts"
        },
        severity: "unknown",
        crop_affected: "unknown"
      }
    }

    console.log('Final analysis result:', analysisResult)

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in pest-identification function:', error)
    
    const errorResponse = {
      identified: false,
      type: "error",
      name: "Analysis Error",
      confidence: 0,
      description: "Unable to analyze the image due to technical issues. Please try again.",
      symptoms: [],
      treatment: {
        immediate: "Take clear photos in good lighting",
        preventive: "Regular monitoring of crops",
        organic: "Maintain healthy soil and plants",
        chemical: "Consult local agricultural experts"
      },
      severity: "unknown",
      crop_affected: "unknown"
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})