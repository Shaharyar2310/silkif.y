import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { processImage, generateImage } from "./openai";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { images, insertImageSchema } from "@shared/schema";
import { z } from "zod";

// Multer storage configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Upload image
  app.post("/api/images/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const filePath = req.file.path;
      const fileName = req.file.filename;
      
      // Generate URLs
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const imageUrl = `${baseUrl}/uploads/${fileName}`;
      
      // Store in database if user is authenticated
      if (req.user) {
        await storage.saveImage({
          userId: req.user.id,
          originalUrl: imageUrl,
          processingType: "upload",
        });
      }
      
      res.json({
        message: "Image uploaded successfully",
        url: imageUrl,
        file: fileName,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  });

  // Apply style to image
  app.post("/api/images/style", async (req, res) => {
    try {
      const { imageUrl, style } = req.body;
      
      if (!imageUrl || !style) {
        return res.status(400).json({ message: "Image URL and style are required" });
      }
      
      // Process the image with the selected style
      const result = await processImage(imageUrl, style);
      
      // Store in database if user is authenticated
      if (req.user) {
        await storage.saveImage({
          userId: req.user.id,
          originalUrl: imageUrl,
          processedUrl: result.processedUrl,
          thumbnailUrl: result.thumbnailUrl,
          style,
          processingType: "style",
        });
      }
      
      res.json({
        message: "Style applied successfully",
        processedUrl: result.processedUrl,
      });
    } catch (error) {
      console.error("Error applying style:", error);
      res.status(500).json({ message: "Error applying style to image" });
    }
  });

  // Enhance image
  app.post("/api/images/enhance", async (req, res) => {
    try {
      const { imageUrl, settings } = req.body;
      
      if (!imageUrl || !settings) {
        return res.status(400).json({ message: "Image URL and settings are required" });
      }
      
      // Process the image with the enhancement settings
      const result = await processImage(imageUrl, "enhance", settings);
      
      // Store in database if user is authenticated
      if (req.user) {
        await storage.saveImage({
          userId: req.user.id,
          originalUrl: imageUrl,
          processedUrl: result.processedUrl,
          thumbnailUrl: result.thumbnailUrl,
          processingType: "enhance",
          metadata: settings,
        });
      }
      
      res.json({
        message: "Image enhanced successfully",
        processedUrl: result.processedUrl,
      });
    } catch (error) {
      console.error("Error enhancing image:", error);
      res.status(500).json({ message: "Error enhancing image" });
    }
  });

  // Generate image from prompt
  app.post("/api/images/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      // Generate image with OpenAI
      const result = await generateImage(prompt);
      
      // Store in database if user is authenticated
      if (req.user) {
        await storage.saveImage({
          userId: req.user.id,
          originalUrl: result.imageUrl,
          processedUrl: result.imageUrl,
          thumbnailUrl: result.thumbnailUrl,
          aiPrompt: prompt,
          processingType: "generate",
        });
      }
      
      res.json({
        message: "Image generated successfully",
        imageUrl: result.imageUrl,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Error generating image" });
    }
  });

  // Get user image history
  app.get("/api/images/history", async (req, res) => {
    try {
      if (!req.user) {
        return res.json([]);
      }
      
      const history = await storage.getUserImages(req.user.id);
      res.json(history);
    } catch (error) {
      console.error("Error fetching image history:", error);
      res.status(500).json({ message: "Error fetching image history" });
    }
  });

  // Clear user image history
  app.delete("/api/images/history", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      await storage.clearUserImages(req.user.id);
      res.json({ message: "Image history cleared successfully" });
    } catch (error) {
      console.error("Error clearing image history:", error);
      res.status(500).json({ message: "Error clearing image history" });
    }
  });

  // User settings
  app.post("/api/settings", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { appearance, notifications, privacy } = req.body;
      
      await storage.saveUserSettings(req.user.id, {
        theme: appearance.theme,
        highContrastMode: appearance.highContrastMode,
        largeText: appearance.largeText,
        emailNotifications: notifications.emailNotifications,
        marketingEmails: notifications.marketingEmails,
        saveHistory: privacy.saveHistory,
        shareUsageData: privacy.shareUsageData,
      });
      
      res.json({ message: "Settings saved successfully" });
    } catch (error) {
      console.error("Error saving user settings:", error);
      res.status(500).json({ message: "Error saving user settings" });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create username from email
      const username = email.split("@")[0];
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password, // In production, hash the password before storing
      });
      
      res.json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In production, compare hashed password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      if (req.session) {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      }
      
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          planType: user.planType,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging out" });
        }
        res.json({ message: "Logout successful" });
      });
    } else {
      res.json({ message: "Logout successful" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const httpServer = createServer(app);

  return httpServer;
}
