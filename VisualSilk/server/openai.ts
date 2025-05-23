import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "OPENAI_API_KEY_NOT_SET",
});

interface ProcessImageResult {
  processedUrl: string;
  thumbnailUrl: string;
}

interface GenerateImageResult {
  imageUrl: string;
  thumbnailUrl: string;
}

// Apply style transfer or enhancement to image
export async function processImage(
  imageUrl: string,
  styleOrType: string,
  settings?: any
): Promise<ProcessImageResult> {
  try {
    // Create a unique filename for the processed image
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const uploadDir = path.join(process.cwd(), "uploads");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Download the original image if it's a remote URL
    let localImagePath = imageUrl;
    if (imageUrl.startsWith("http")) {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageName = `original-${uniqueSuffix}.jpg`;
      localImagePath = path.join(uploadDir, imageName);
      fs.writeFileSync(localImagePath, response.data);
    }

    // Read image file as binary data
    const imageBuffer = fs.readFileSync(localImagePath);
    const base64Image = imageBuffer.toString("base64");

    // Determine what kind of processing to do
    let prompt = "";
    if (styleOrType === "enhance") {
      prompt = buildEnhancementPrompt(settings);
    } else {
      prompt = buildStyleTransferPrompt(styleOrType);
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for vision capabilities
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Generate image using DALL-E based on the GPT-4o description
    const description = response.choices[0].message.content;
    const generationResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Based on this image description: ${description}. Do not add any text or watermarks.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    // Download the generated image
    const generatedImageUrl = generationResponse.data[0].url;
    const generatedResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Save the processed image
    const processedImageName = `processed-${uniqueSuffix}.png`;
    const processedImagePath = path.join(uploadDir, processedImageName);
    fs.writeFileSync(processedImagePath, generatedResponse.data);

    // Create a thumbnail (use the same image for now, in production you'd resize it)
    const thumbnailName = `thumbnail-${uniqueSuffix}.png`;
    const thumbnailPath = path.join(uploadDir, thumbnailName);
    fs.writeFileSync(thumbnailPath, generatedResponse.data);

    // Return the URLs
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    return {
      processedUrl: `${baseUrl}/uploads/${processedImageName}`,
      thumbnailUrl: `${baseUrl}/uploads/${thumbnailName}`,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

// Generate image from text prompt
export async function generateImage(prompt: string): Promise<GenerateImageResult> {
  try {
    // Create a unique filename for the generated image
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const uploadDir = path.join(process.cwd(), "uploads");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Call DALL-E to generate the image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}. Do not add any text or watermarks.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    // Download the generated image
    const generatedImageUrl = response.data[0].url;
    const imageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Save the generated image
    const imageName = `generated-${uniqueSuffix}.png`;
    const imagePath = path.join(uploadDir, imageName);
    fs.writeFileSync(imagePath, imageResponse.data);

    // Create a thumbnail (use the same image for now, in production you'd resize it)
    const thumbnailName = `thumbnail-${uniqueSuffix}.png`;
    const thumbnailPath = path.join(uploadDir, thumbnailName);
    fs.writeFileSync(thumbnailPath, imageResponse.data);

    // Return the URLs
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    return {
      imageUrl: `${baseUrl}/uploads/${imageName}`,
      thumbnailUrl: `${baseUrl}/uploads/${thumbnailName}`,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

// Helper functions to build prompts
function buildStyleTransferPrompt(style: string): string {
  const stylePrompts = {
    "Ghibli Art": "You are an expert image stylist specializing in Studio Ghibli art style. Transform the provided image into an illustration that perfectly captures the whimsical, detailed, and colorful aesthetic of Studio Ghibli animations. Maintain the composition and main elements, but reimagine them with hand-drawn quality, soft color palettes, and the magical atmosphere characteristic of Ghibli films like 'Spirited Away' or 'My Neighbor Totoro'.",
    
    "Anime Pop": "You are an expert image stylist specializing in modern anime pop art. Transform the provided image into a vibrant anime illustration with bold outlines, exaggerated features, and bright color schemes. Add dynamic elements typical of anime such as speed lines, expressive eyes, and stylized proportions. Emphasize a energetic, colorful aesthetic similar to contemporary anime shows.",
    
    "Sketch": "You are an expert image stylist specializing in sketch art. Transform the provided image into a detailed pencil sketch drawing. Convert the colors to grayscale, emphasize lines and edges, add appropriate shading and texture, and give it an authentic hand-drawn quality with visible pencil strokes. The final result should look like it was skillfully sketched by an artist in a sketchbook.",
    
    "Sci-Fi Neon": "You are an expert image stylist specializing in cyberpunk and sci-fi neon aesthetics. Transform the provided image with a futuristic cyberpunk style featuring bright neon colors (primarily blue, purple, and pink), high contrast, digital glitch effects, and a night-time urban atmosphere. Add subtle tech elements like circuit patterns, holographic overlays, or digital interfaces where appropriate. The image should evoke the aesthetic of films like 'Blade Runner' or 'Ghost in the Shell'."
  };

  return stylePrompts[style] || 
    "Transform the provided image into a stylized version while maintaining the key elements and composition.";
}

function buildEnhancementPrompt(settings: any): string {
  // Construct a prompt based on enhancement settings
  let enhancements = [];
  
  if (settings.brightness !== 0) {
    const direction = settings.brightness > 0 ? "Increase" : "Decrease";
    const amount = Math.abs(settings.brightness);
    enhancements.push(`${direction} brightness by ${amount}%.`);
  }
  
  if (settings.contrast !== 0) {
    const direction = settings.contrast > 0 ? "Increase" : "Decrease";
    const amount = Math.abs(settings.contrast);
    enhancements.push(`${direction} contrast by ${amount}%.`);
  }
  
  if (settings.sharpness > 0) {
    enhancements.push(`Enhance sharpness by ${settings.sharpness}%.`);
  }
  
  if (settings.autoEnhance) {
    enhancements.push("Automatically enhance overall image quality with balanced adjustments to color, saturation, and lighting.");
  }
  
  if (settings.denoise) {
    enhancements.push("Reduce noise and grain while preserving important details.");
  }
  
  if (settings.upscale) {
    enhancements.push("Increase resolution and clarity using AI upscaling techniques.");
  }
  
  if (settings.bgRemove) {
    enhancements.push("Remove or blur the background to make the subject stand out more.");
  }
  
  if (settings.faceRetouch) {
    enhancements.push("Apply subtle face retouching to improve skin appearance while maintaining natural look.");
  }
  
  if (enhancements.length === 0) {
    enhancements.push("Apply standard image enhancement to improve clarity and visual appeal.");
  }
  
  return `You are an expert photo editor. Enhance the provided image with the following adjustments: ${enhancements.join(" ")} The final result should look professionally edited and natural.`;
}
