import { users, userSettings, images, type User, type InsertUser, type UserSettings, type InsertUserSettings, type Image, type InsertImage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  saveUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  
  // Image operations
  saveImage(image: Partial<InsertImage>): Promise<Image>;
  getUserImages(userId: number): Promise<Image[]>;
  getImage(id: number): Promise<Image | undefined>;
  clearUserImages(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userSettings: Map<number, UserSettings>;
  private images: Map<number, Image>;
  private currentUserId: number;
  private currentImageId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.userSettings = new Map();
    this.images = new Map();
    this.currentUserId = 1;
    this.currentImageId = 1;
    this.currentSettingsId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      updatedAt: now,
      profileImage: "https://via.placeholder.com/150",
      planType: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
    this.users.set(id, user);
    return user;
  }
  
  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }
  
  async saveUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    // Check if settings exist for user
    const existingSettings = await this.getUserSettings(userId);
    
    if (existingSettings) {
      // Update existing settings
      const updatedSettings: UserSettings = {
        ...existingSettings,
        ...settings,
        updatedAt: new Date(),
      };
      this.userSettings.set(existingSettings.id, updatedSettings);
      return updatedSettings;
    } else {
      // Create new settings
      const id = this.currentSettingsId++;
      const now = new Date();
      const newSettings: UserSettings = {
        id,
        userId,
        theme: settings.theme || "light",
        highContrastMode: settings.highContrastMode || false,
        largeText: settings.largeText || false,
        emailNotifications: settings.emailNotifications || true,
        marketingEmails: settings.marketingEmails || false,
        saveHistory: settings.saveHistory || true,
        shareUsageData: settings.shareUsageData || true,
        updatedAt: now,
      };
      this.userSettings.set(id, newSettings);
      return newSettings;
    }
  }
  
  // Image operations
  async saveImage(image: Partial<InsertImage>): Promise<Image> {
    const id = this.currentImageId++;
    const now = new Date();
    const newImage: Image = {
      id,
      userId: image.userId || null,
      originalUrl: image.originalUrl!,
      processedUrl: image.processedUrl || null,
      thumbnailUrl: image.thumbnailUrl || null,
      style: image.style || null,
      aiPrompt: image.aiPrompt || null,
      processingType: image.processingType!,
      metadata: image.metadata || null,
      createdAt: now,
    };
    this.images.set(id, newImage);
    return newImage;
  }
  
  async getUserImages(userId: number): Promise<Image[]> {
    return Array.from(this.images.values())
      .filter(image => image.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getImage(id: number): Promise<Image | undefined> {
    return this.images.get(id);
  }
  
  async clearUserImages(userId: number): Promise<void> {
    const imagesToDelete = Array.from(this.images.values())
      .filter(image => image.userId === userId)
      .map(image => image.id);
    
    for (const id of imagesToDelete) {
      this.images.delete(id);
    }
  }
}

export const storage = new MemStorage();
