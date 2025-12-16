import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export interface WasteScanResult {
  wasteType: 'ORGANIC' | 'PLASTIC' | 'METAL' | 'PAPER';
  confidence: number;
  estimatedWeight: number;
  description: string;
}

export async function analyzeWasteImage(base64Image: string): Promise<WasteScanResult> {
  // Check API key
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Remove data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are an EXPERT waste classification AI with STRICT accuracy requirements. You MUST carefully analyze the ACTUAL VISUAL CONTENT of this image.

CRITICAL INSTRUCTIONS:
1. Look VERY CAREFULLY at the actual object in the image
2. Identify the MATERIAL the object is made of, not just its appearance
3. Do NOT default to any type - analyze the actual content
4. If the image is unclear or shows multiple items, focus on the primary/largest item
5. If confidence is below 50%, the image might be unclear

ANALYZE THE IMAGE AND DETERMINE:
1. What type of waste is shown (MUST choose exactly one: organic, plastic, metal, or paper)
2. How confident you are (0-100%) - be honest about uncertainty
3. Estimated weight in kg (0.1 to 10)
4. Brief description of what you see

RESPOND ONLY WITH THIS JSON FORMAT (no other text):
{
  "wasteType": "plastic",
  "confidence": 85,
  "estimatedWeight": 0.5,
  "description": "A plastic water bottle"
}

=== VISUAL IDENTIFICATION GUIDE ===

🟢 ORGANIC (Natural, Biodegradable, Green/Brown colors):
EXAMPLES: banana peel, apple core, leftover rice, vegetables, fruit peels, leaves, grass, flowers, egg shells, tea bags, coffee grounds, bread, cooked food
VISUAL CLUES: Soft/wet texture, natural colors (green, brown, yellow), irregular organic shapes, may show decay/browning
NEVER: Anything shiny, rigid plastic, or metallic

🔵 PLASTIC (Synthetic, Smooth, Shiny):
EXAMPLES: water bottles (Aqua, Le Minerale, etc), plastic bags, food containers, yogurt cups, straws, plastic caps, shampoo bottles, detergent bottles, plastic wrap
VISUAL CLUES: Shiny/glossy surface, synthetic material, molded uniform shape, often transparent or brightly colored, lightweight appearance
LOOK FOR: Recycling symbols, brand labels, smooth manufactured edges

🟡 METAL (Metallic Sheen, Rigid, Reflective):
EXAMPLES: aluminum cans (Coca-Cola, Sprite, beer cans), tin cans, food cans, aluminum foil, metal lids, coins, keys
VISUAL CLUES: Metallic reflection/sheen, silver/gold/bronze color, rigid and hard, cylindrical can shape, may show dents
LOOK FOR: Pull tabs on cans, metallic surface reflection

🟤 PAPER (Fibrous, Matte, Flexible):
EXAMPLES: newspapers, cardboard boxes, magazines, office paper, paper bags, tissue, books, receipts, egg cartons (paper type), paper cups
VISUAL CLUES: Fibrous matte texture, bendable without breaking, usually white/brown/printed colors, may show text/print
LOOK FOR: Visible paper fibers, text/printing, folded or creased surfaces

=== IMPORTANT REMINDERS ===
- A PLASTIC BOTTLE is PLASTIC, not organic
- A METAL CAN is METAL, not plastic
- CARDBOARD BOX is PAPER, not organic
- FOOD WASTE is ORGANIC
- BE ACCURATE. Analyze what is ACTUALLY in the image.
- DO NOT GUESS. If truly unsure, provide low confidence score.`;

    console.log('Sending image to Gemini API...');
    console.log('Image data length:', imageData.length);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      },
    ]);

    const response = result.response.text();
    console.log('Gemini raw response:', response);
    
    // Extract JSON from response - handle markdown code blocks too
    let jsonString = response;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    }
    
    // Extract JSON object
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', response);
      throw new Error('Invalid response format - no JSON found');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log('Parsed response:', parsed);

    // Normalize waste type to uppercase
    const rawWasteType = (parsed.wasteType || 'organic').toString().toUpperCase().trim();
    
    // Validate waste type
    const validTypes = ['ORGANIC', 'PLASTIC', 'METAL', 'PAPER'];
    const wasteType = validTypes.includes(rawWasteType) 
      ? rawWasteType as WasteScanResult['wasteType']
      : 'ORGANIC';

    const confidence = Math.min(100, Math.max(0, Number(parsed.confidence) || 50));
    const estimatedWeight = Math.min(10, Math.max(0.1, Number(parsed.estimatedWeight) || 0.5));

    console.log('Final result:', { wasteType, confidence, estimatedWeight });

    return {
      wasteType,
      confidence,
      estimatedWeight,
      description: parsed.description || 'Waste detected',
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    
    // Re-throw the error instead of returning fallback
    // This way the API route will handle it properly
    throw error;
  }
}
