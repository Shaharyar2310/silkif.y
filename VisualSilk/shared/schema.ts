import { pgTable, text, serial, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: varchar("email").notNull().unique(),
  password: text("password").notNull(),
  profileImage: text("profile_image").default("https://via.placeholder.com/150"),
  planType: text("plan_type").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id).notNull(),
  theme: text("theme").default("light").notNull(),
  highContrastMode: boolean("high_contrast_mode").default(false).notNull(),
  largeText: boolean("large_text").default(false).notNull(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  marketingEmails: boolean("marketing_emails").default(false).notNull(),
  saveHistory: boolean("save_history").default(true).notNull(),
  shareUsageData: boolean("share_usage_data").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Images table
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  originalUrl: text("original_url").notNull(),
  processedUrl: text("processed_url"),
  thumbnailUrl: text("thumbnail_url"),
  style: text("style"),
  aiPrompt: text("ai_prompt"),
  processingType: text("processing_type").notNull(), // "style", "enhance", "generate"
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type User = typeof users.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type Image = typeof images.$inferSelect;
