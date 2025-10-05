import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateImage(
  prompt: string,
  size: string,
  baseImage?: string,
): Promise<string> {
  try {
    const parts: any[] = [];

    // If there's a base image, add it first for image editing
    if (baseImage) {
      // Extract base64 data from data URL
      const base64Data = baseImage.includes('base64,') 
        ? baseImage.split('base64,')[1] 
        : baseImage;
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      });
      parts.push({ 
        text: `Edit this image: ${prompt}. Maintain the ${size} dimensions.` 
      });
    } else {
      // Text-to-image generation
      parts.push({ 
        text: `${prompt}. Generate this image at ${size} resolution.` 
      });
    }

    // IMPORTANT: only this gemini model supports image generation
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content parts in response");
    }

    for (const part of content.parts) {
      if (part.text) {
        console.log("Gemini response text:", part.text);
      } else if (part.inlineData && part.inlineData.data) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || "image/png";
        return `data:${mimeType};base64,${imageData}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
