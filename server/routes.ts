import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateImageSchema } from "@shared/schema";
import { generateImage } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate-image", async (req, res) => {
    try {
      const validationResult = generateImageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: validationResult.error.errors 
        });
      }

      const { prompt, size, baseImage } = validationResult.data;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          message: "GEMINI_API_KEY is not configured" 
        });
      }

      const imageData = await generateImage(prompt, size, baseImage);

      return res.json({ imageData });
    } catch (error) {
      console.error("Error generating image:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate image"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
