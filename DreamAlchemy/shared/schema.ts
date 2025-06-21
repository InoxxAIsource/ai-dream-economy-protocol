import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  walletAddress: text("wallet_address"),
  connectedTracker: text("connected_tracker"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  moodRating: integer("mood_rating").notNull(),
  clarityRating: integer("clarity_rating").notNull(),
  vividnessRating: integer("vividness_rating").notNull(),
  tags: text("tags").array(),
  isPrivate: boolean("is_private").default(true),
  recordedAt: timestamp("recorded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dreamAnalyses = pgTable("dream_analyses", {
  id: serial("id").primaryKey(),
  dreamId: integer("dream_id").notNull().references(() => dreams.id),
  interpretation: text("interpretation").notNull(),
  symbols: jsonb("symbols"),
  emotions: text("emotions").array(),
  personalityInsights: text("personality_insights").array(),
  trendPredictions: text("trend_predictions").array(),
  rarityScore: integer("rarity_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dreamNFTs = pgTable("dream_nfts", {
  id: serial("id").primaryKey(),
  dreamId: integer("dream_id").notNull().references(() => dreams.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  artStyle: text("art_style").notNull(),
  rarity: text("rarity").notNull(),
  rarityScore: integer("rarity_score").notNull(),
  price: decimal("price", { precision: 10, scale: 4 }),
  isMinted: boolean("is_minted").default(false),
  mintedAt: timestamp("minted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sleepData = pgTable("sleep_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  totalSleep: integer("total_sleep_minutes"),
  remSleep: integer("rem_sleep_minutes"),
  deepSleep: integer("deep_sleep_minutes"),
  lightSleep: integer("light_sleep_minutes"),
  sleepQuality: integer("sleep_quality"),
  dreamFrequency: integer("dream_frequency"),
  tracker: text("tracker"),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const miningRewards = pgTable("mining_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dreamId: integer("dream_id").references(() => dreams.id),
  activity: text("activity").notNull(),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  currency: text("currency").default("USD"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  dreams: many(dreams),
  sleepData: many(sleepData),
  miningRewards: many(miningRewards),
  dreamNFTs: many(dreamNFTs),
}));

export const dreamsRelations = relations(dreams, ({ one, many }) => ({
  user: one(users, {
    fields: [dreams.userId],
    references: [users.id],
  }),
  analysis: one(dreamAnalyses),
  nfts: many(dreamNFTs),
  rewards: many(miningRewards),
}));

export const dreamAnalysesRelations = relations(dreamAnalyses, ({ one }) => ({
  dream: one(dreams, {
    fields: [dreamAnalyses.dreamId],
    references: [dreams.id],
  }),
}));

export const dreamNFTsRelations = relations(dreamNFTs, ({ one }) => ({
  dream: one(dreams, {
    fields: [dreamNFTs.dreamId],
    references: [dreams.id],
  }),
  user: one(users, {
    fields: [dreamNFTs.userId],
    references: [users.id],
  }),
}));

export const sleepDataRelations = relations(sleepData, ({ one }) => ({
  user: one(users, {
    fields: [sleepData.userId],
    references: [users.id],
  }),
}));

export const miningRewardsRelations = relations(miningRewards, ({ one }) => ({
  user: one(users, {
    fields: [miningRewards.userId],
    references: [users.id],
  }),
  dream: one(dreams, {
    fields: [miningRewards.dreamId],
    references: [dreams.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
});

export const insertDreamSchema = createInsertSchema(dreams).omit({
  id: true,
  createdAt: true,
});

export const insertDreamAnalysisSchema = createInsertSchema(dreamAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertDreamNFTSchema = createInsertSchema(dreamNFTs).omit({
  id: true,
  createdAt: true,
  mintedAt: true,
});

export const insertSleepDataSchema = createInsertSchema(sleepData).omit({
  id: true,
  createdAt: true,
});

export const insertMiningRewardSchema = createInsertSchema(miningRewards).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Dream = typeof dreams.$inferSelect;
export type InsertDream = z.infer<typeof insertDreamSchema>;
export type DreamAnalysis = typeof dreamAnalyses.$inferSelect;
export type InsertDreamAnalysis = z.infer<typeof insertDreamAnalysisSchema>;
export type DreamNFT = typeof dreamNFTs.$inferSelect;
export type InsertDreamNFT = z.infer<typeof insertDreamNFTSchema>;
export type SleepData = typeof sleepData.$inferSelect;
export type InsertSleepData = z.infer<typeof insertSleepDataSchema>;
export type MiningReward = typeof miningRewards.$inferSelect;
export type InsertMiningReward = z.infer<typeof insertMiningRewardSchema>;
