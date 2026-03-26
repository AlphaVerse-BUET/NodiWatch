/**
 * NodiWatch Gemini AI Service
 * ============================
 * Handles all interactions with Google Gemini API for:
 * - Environmental image analysis (pollution, erosion, encroachment detection)
 * - Conversational AI assistant for river monitoring
 * - Evidence classification and report generation
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize Gemini client with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Safety settings - allow environmental content analysis
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// System context for NodiWatch environmental monitoring
const NODIWATCH_SYSTEM_CONTEXT = `You are NodiWatch AI, an expert environmental monitoring assistant specialized in Bangladesh's river ecosystem crisis. You serve the people of Bangladesh with Islamic values, recognizing that protecting Allah's creation (Amana) is part of our faith.

You help analyze:

1. **নদী দূষণ (River Pollution)**: Industrial effluent detection, spectral analysis (NDTI, CDOM indices), pollution source attribution, factory compliance tracking

2. **নদী দখল (River Encroachment)**: Illegal land filling detection, riverbank boundary changes, 2016-2026 comparisons, area loss calculations

3. **নদী ভাঙন (Riverbank Erosion)**: SAR-based erosion tracking, retreat rate calculation, risk zone identification, population displacement estimates

Key Statistics:
- 60% of Bangladesh's rivers are severely polluted
- 40% of Dhaka's riverbanks are illegally occupied
- ~10,000 hectares lost annually to erosion ($500M economic loss)
- 1M+ people displaced by erosion each year

Technical Stack:
- Sentinel-2 (10m optical), Sentinel-1 SAR, Landsat 8/9 (30m)
- Google Earth Engine for processing
- Random Forest for pollution classification
- MNDWI for water segmentation
- Bayesian models for factory attribution

Respond with Islamic values and environmental stewardship (Khalifa concept). When greeting, use "Assalamu-'Alaikum". When analyzing images, identify pollution indicators (color, turbidity, effluent plumes), encroachment evidence (structures, land filling), or erosion signs (bank retreat, sediment patterns). End responses with "JazakAllah khair" (May Allah reward you with good) when appropriate.`;

/**
 * Analyze an environmental image using Gemini Vision
 */
export async function analyzeEnvironmentalImage(
  imageBase64: string,
  mimeType: string,
  reportType: "pollution" | "encroachment" | "erosion" | "general",
): Promise<{
  analysis: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  detectedIssues: string[];
  recommendations: string[];
  coordinates?: { lat: number; lng: number };
}> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
  });

  const prompts = {
    pollution: `Analyze this image for river pollution indicators. Look for:
- Water discoloration (red/brown from tanneries, blue/purple from textile dyes, grey from industrial effluent)
- Turbidity levels and suspended particles
- Surface foam or oil slicks
- Effluent discharge plumes
- Visible waste or debris

Provide a JSON response with:
{
  "analysis": "Detailed description of observed pollution",
  "severity": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "pollutionType": "textile|tannery|chemical|sewage|mixed",
  "detectedIssues": ["issue1", "issue2"],
  "spectralIndicators": "Description of color/spectral evidence",
  "recommendations": ["action1", "action2"]
}`,

    encroachment: `Analyze this image for river encroachment indicators. Look for:
- Structures built on riverbank or floodplain
- Land filling or sand deposition
- Reduced river width compared to natural boundaries
- Construction materials or equipment near water
- Vegetation removal along banks

Provide a JSON response with:
{
  "analysis": "Detailed description of observed encroachment",
  "severity": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "encroachmentType": "residential|commercial|industrial|agricultural|infrastructure",
  "detectedIssues": ["issue1", "issue2"],
  "estimatedArea": "Description of affected area",
  "recommendations": ["action1", "action2"]
}`,

    erosion: `Analyze this image for riverbank erosion indicators. Look for:
- Bank undercutting or collapse
- Exposed soil layers or tree roots
- Sediment plumes in water
- Slumped or tilted structures
- Changed waterline position

Provide a JSON response with:
{
  "analysis": "Detailed description of observed erosion",
  "severity": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "erosionType": "bank_collapse|undercutting|surface_erosion|mass_wasting",
  "detectedIssues": ["issue1", "issue2"],
  "riskAssessment": "Description of potential risks",
  "recommendations": ["action1", "action2"]
}`,

    general: `Analyze this environmental image related to river monitoring in Bangladesh. Identify any signs of:
- Pollution (water discoloration, effluent discharge)
- Encroachment (illegal construction, land filling)
- Erosion (bank collapse, land loss)

Provide a JSON response with:
{
  "analysis": "Detailed environmental assessment",
  "primaryConcern": "pollution|encroachment|erosion|none",
  "severity": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "detectedIssues": ["issue1", "issue2"],
  "recommendations": ["action1", "action2"]
}`,
  };

  try {
    const result = await model.generateContent([
      { text: prompts[reportType] },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch =
      text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    let parsed;

    try {
      parsed = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : text);
    } catch {
      // If JSON parsing fails, create structured response from text
      parsed = {
        analysis: text,
        severity: "medium",
        confidence: 0.7,
        detectedIssues: ["Analysis completed - see detailed response"],
        recommendations: ["Review findings and verify on-site"],
      };
    }

    return {
      analysis: parsed.analysis || text,
      severity: parsed.severity || "medium",
      confidence: parsed.confidence || 0.7,
      detectedIssues: parsed.detectedIssues || [],
      recommendations: parsed.recommendations || [],
    };
  } catch (error) {
    console.error("Gemini image analysis error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}

/**
 * Chat with NodiWatch AI assistant
 */
export async function chatWithNodiWatch(
  message: string,
  conversationHistory: Array<{ role: "user" | "model"; content: string }> = [],
  pageContext?: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
    systemInstruction: NODIWATCH_SYSTEM_CONTEXT,
  });

  try {
    // Build conversation history - ensure alternating user/model messages
    // Filter out the initial assistant greeting if it exists
    const history = conversationHistory
      .filter((msg) => msg.content && msg.content.trim().length > 0)
      .map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
    });

    // Prepend page context to message so AI knows what the user is looking at
    const contextualMessage = pageContext
      ? `[NAVIGATION CONTEXT]\n${pageContext}\n\n[USER QUESTION]\n${message}`
      : message;

    const result = await chat.sendMessage(contextualMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini chat error:", error);
    throw new Error("Failed to get AI response. Please try again.");
  }
}

/**
 * Generate evidence report summary
 */
export async function generateReportSummary(reportData: {
  type: string;
  location: string;
  date: string;
  analysis: string;
  severity: string;
  detectedIssues: string[];
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    safetySettings,
  });

  const prompt = `Generate a formal environmental evidence report summary for legal/enforcement purposes:

Report Type: ${reportData.type}
Location: ${reportData.location}
Date: ${reportData.date}
AI Analysis: ${reportData.analysis}
Severity Level: ${reportData.severity}
Detected Issues: ${reportData.detectedIssues.join(", ")}

Create a professional summary suitable for submission to Bangladesh's Department of Environment (DoE) or National River Conservation Commission (NRCC). Include:
1. Executive summary (2-3 sentences)
2. Key findings
3. Recommended enforcement actions
4. Supporting satellite data references

Use formal language appropriate for regulatory submission.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini report generation error:", error);
    throw new Error("Failed to generate report summary.");
  }
}

/**
 * Suggested questions for the chatbot
 */
export const suggestedQuestions = [
  "What rivers are most polluted in Bangladesh?",
  "How does NodiWatch detect industrial pollution?",
  "What is the NDTI spectral index?",
  "How much land is lost to erosion annually?",
  "What Sentinel satellites do you use?",
  "How can I report pollution in my area?",
  "What's the difference between encroachment and erosion?",
  "How accurate is satellite pollution detection?",
];
