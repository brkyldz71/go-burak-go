import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Trend topics discovered from scanning platforms
export const trendTopics = pgTable("trend_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  source: text("source").notNull(), // reddit, tiktok, youtube
  category: text("category").notNull(), // hitchhiking, budget_travel, asia_routes, backpacking, world_tour
  description: text("description").notNull(),
  trendScore: integer("trend_score").notNull().default(0),
  hashtags: text("hashtags"), // comma separated
  isActive: boolean("is_active").notNull().default(true),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Video scenarios generated from trends
export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  trendTopicId: integer("trend_topic_id").references(() => trendTopics.id),
  title: text("title").notNull(),
  hook: text("hook").notNull(), // merak uyandırıcı giriş
  story: text("story").notNull(), // bilgi verici içerik
  cta: text("cta").notNull(), // kapanış
  fullScript: text("full_script").notNull(),
  durationSeconds: integer("duration_seconds").notNull().default(45),
  language: text("language").notNull().default("tr"),
  targetPlatform: text("target_platform").notNull(), // tiktok, instagram_reels, youtube_shorts
  status: text("status").notNull().default("draft"), // draft, approved, produced, published
  contentType: text("content_type").notNull().default("original"), // original, pre_launch, stock_based
  stockMediaUrls: jsonb("stock_media_urls").$type<string[]>(),
  needsFootage: boolean("needs_footage").notNull().default(true), // true = çekim gerekli
  footageNotes: text("footage_notes"), // çekim notları
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Content publishing schedule
export const publishSchedule = pgTable("publish_schedule", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").references(() => scenarios.id),
  platform: text("platform").notNull(), // tiktok, instagram, youtube
  scheduledAt: timestamp("scheduled_at").notNull(),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("scheduled"), // scheduled, publishing, published, failed
  caption: text("caption"),
  hashtags: text("hashtags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Countries in the world tour
export const tourCountries = pgTable("tour_countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  region: text("region").notNull(),
  orderIndex: integer("order_index").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, current, completed
  arrivalDate: text("arrival_date"),
  departureDate: text("departure_date"),
  dailyBudget: text("daily_budget"),
  highlights: text("highlights"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Social media account settings
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().unique(), // tiktok, instagram, youtube
  accountName: text("account_name"),
  accountUrl: text("account_url"),
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  isConnected: boolean("is_connected").notNull().default(false),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// App settings
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
