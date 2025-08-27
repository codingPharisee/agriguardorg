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
    const { soilData, location, season } = await req.json()
    
    if (!soilData && !location) {
      throw new Error('Soil data or location is required')
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing crop recommendations for:', { soilData, location, season })

    // Prepare context for AI analysis
    let contextInfo = 'Based on the following information:\n\n'
    
    if (soilData) {
      contextInfo += `Soil Analysis:\n`
      if (soilData.ph) contextInfo += `- pH Level: ${soilData.ph}\n`
      if (soilData.nitrogen) contextInfo += `- Nitrogen: ${soilData.nitrogen}\n`
      if (soilData.phosphorus) contextInfo += `- Phosphorus: ${soilData.phosphorus}\n`
      if (soilData.potassium) contextInfo += `- Potassium: ${soilData.potassium}\n`
      if (soilData.organic_matter) contextInfo += `- Organic Matter: ${soilData.organic_matter}%\n`
      if (soilData.moisture) contextInfo += `- Moisture Content: ${soilData.moisture}%\n`
      if (soilData.texture) contextInfo += `- Soil Texture: ${soilData.texture}\n`
    }
    
    if (location) {
      contextInfo += `\nLocation: ${location}\n`
    }
    
    if (season) {
      contextInfo += `Season/Time: ${season}\n`
    }

    const systemPrompt = `You are an expert agricultural advisor specializing in African farming systems and sustainable agriculture.
    
    Provide personalized crop recommendations based on the soil and environmental data provided.
    
    ${contextInfo}
    
    Consider:
    - Climate suitability for the location
    - Soil requirements for different crops
    - Seasonal planting windows
    - Market demand and profitability
    - Sustainable farming practices
    - Water requirements and availability
    - Disease/pest resistance
    - Nutritional security
    
    Provide response in JSON format:
    {
      "primary_recommendations": [
        {
          "crop": "crop name",
          "variety": "recommended variety",
          "suitability_score": 1-10,
          "reasons": ["reason1", "reason2"],
          "planting_window": "best time to plant",
          "expected_yield": "estimated yield",
          "market_value": "high/medium/low"
        }
      ],
      "soil_improvements": [
        {
          "issue": "soil issue identified",
          "solution": "recommended solution",
          "priority": "high/medium/low"
        }
      ],
      "seasonal_calendar": {
        "current_activities": ["activity1", "activity2"],
        "next_month": ["activity1", "activity2"],
        "harvest_time": "estimated harvest period"
      },
      "additional_tips": ["tip1", "tip2", "tip3"]
    }`

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
          { role: 'user', content: `Please provide crop recommendations based on the provided data.` }
        ],
        temperature: 0.3,
        max_tokens: 1000,
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

    // Parse JSON response
    let recommendations
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0])
      } else {
        // Fallback response
        recommendations = {
          primary_recommendations: [
            {
              crop: "Mixed vegetables",
              variety: "Local varieties",
              suitability_score: 7,
              reasons: ["Adaptable to local conditions", "Good nutritional value"],
              planting_window: "Current season",
              expected_yield: "Moderate",
              market_value: "medium"
            }
          ],
          soil_improvements: [
            {
              issue: "General soil health",
              solution: "Add organic compost and practice crop rotation",
              priority: "medium"
            }
          ],
          seasonal_calendar: {
            current_activities: ["Soil preparation", "Seed selection"],
            next_month: ["Planting", "Initial care"],
            harvest_time: "3-4 months"
          },
          additional_tips: [
            "Monitor weather patterns",
            "Use water conservation techniques",
            "Implement integrated pest management"
          ]
        }
      }
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback:', parseError)
      recommendations = {
        primary_recommendations: [],
        soil_improvements: [],
        seasonal_calendar: {
          current_activities: [],
          next_month: [],
          harvest_time: ""
        },
        additional_tips: ["Consult with local agricultural extension services"]
      }
    }

    console.log('Final recommendations:', recommendations)

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in crop-recommendations function:', error)
    
    const errorResponse = {
      primary_recommendations: [],
      soil_improvements: [
        {
          issue: "Analysis error",
          solution: "Please provide more detailed soil and location information",
          priority: "high"
        }
      ],
      seasonal_calendar: {
        current_activities: ["Collect soil samples", "Consult local experts"],
        next_month: ["Re-attempt analysis with better data"],
        harvest_time: "To be determined"
      },
      additional_tips: [
        "Ensure accurate soil testing",
        "Provide location details",
        "Consult local agricultural extension services"
      ]
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})