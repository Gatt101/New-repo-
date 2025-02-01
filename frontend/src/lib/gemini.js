import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDucQD1ef6JmF6nxoLL4AC77G8DThbgsR0");

export async function translateGenZText(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze and translate the following text. Return a JSON object with this exact structure:
      {
        "containsSlang": true/false,
        "translation": "translated text here if slang exists, null if no slang",
        "explanation": [
          {
            "original": "slang word",
            "meaning": "formal meaning"
          }
        ]
      }

      Text to analyze: "${text}"

      Guidelines:
      - If text contains Gen-Z slang, translate to elder-friendly language
      - Keep translations warm and respectful
      - Maintain the original sentiment
      - Use proper grammar
      - Example: "grandma is op" → translation: "Grandmother, you are incredibly skilled"

      Return only the JSON object, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      // Clean the response text to ensure valid JSON
      const cleanResponse = response.text().trim()
        .replace(/^```json\s*/, '')  // Remove JSON code block markers if present
        .replace(/```$/, '')         // Remove ending code block marker
        .trim();
        
      const analysis = JSON.parse(cleanResponse);
      
      if (analysis.containsSlang) {
        console.log("Translation:", analysis.translation);
        console.log("Explanations:", analysis.explanation);
        return {
          original: text,
          translated: analysis.translation,
          explanation: analysis.explanation
        };
      }
      
      return {
        original: text,
        translated: null,
        explanation: null
      };
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      console.log("Raw response:", response.text());
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error in translation:", error);
    throw new Error("Failed to analyze text");
  }
} 