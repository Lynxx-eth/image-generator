import { z } from "zod";

// Image generation request schema
export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt must be less than 1000 characters"),
  size: z.enum(["512x512", "1024x1024", "1920x1080", "1500x500"]),
  baseImage: z.string().optional(), // base64 encoded image for editing
});

export type GenerateImageRequest = z.infer<typeof generateImageSchema>;

// Image generation response schema
export interface GeneratedImage {
  id: string;
  imageData: string; // base64 encoded image
  prompt: string;
  size: string;
  createdAt: Date;
}

// Size options for the dropdown
export const sizeOptions = [
  { value: "512x512", label: "512×512", description: "Small square format" },
  { value: "1024x1024", label: "1024×1024", description: "Large square format" },
  { value: "1920x1080", label: "1920×1080", description: "Full HD landscape" },
  { value: "1500x500", label: "1500×500", description: "Twitter banner size" },
] as const;
