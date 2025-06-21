import { 
  users, 
  dreams,
  dreamAnalyses,
  dreamNFTs,
  sleepData,
  miningRewards,
  type User, 
  type InsertUser,
  type Dream,
  type InsertDream,
  type DreamAnalysis,
  type InsertDreamAnalysis,
  type DreamNFT,
  type InsertDreamNFT,
  type SleepData,
  type InsertSleepData,
  type MiningReward,
  type InsertMiningReward
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Dream operations
  getDream(id: number): Promise<Dream | undefined>;
  getDreamsByUser(userId: number): Promise<Dream[]>;
  createDream(dream: InsertDream): Promise<Dream>;
  updateDream(id: number, updates: Partial<InsertDream>): Promise<Dream | undefined>;

  // Dream analysis operations
  getDreamAnalysis(dreamId: number): Promise<DreamAnalysis | undefined>;
  createDreamAnalysis(analysis: InsertDreamAnalysis): Promise<DreamAnalysis>;

  // Dream NFT operations
  getDreamNFT(id: number): Promise<DreamNFT | undefined>;
  getDreamNFTsByUser(userId: number): Promise<DreamNFT[]>;
  getAllDreamNFTs(): Promise<DreamNFT[]>;
  createDreamNFT(nft: InsertDreamNFT): Promise<DreamNFT>;

  // Sleep data operations
  getSleepDataByUser(userId: number): Promise<SleepData[]>;
  createSleepData(data: InsertSleepData): Promise<SleepData>;

  // Mining rewards operations
  getMiningRewardsByUser(userId: number): Promise<MiningReward[]>;
  createMiningReward(reward: InsertMiningReward): Promise<MiningReward>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Dream operations
  async getDream(id: number): Promise<Dream | undefined> {
    const [dream] = await db.select().from(dreams).where(eq(dreams.id, id));
    return dream || undefined;
  }

  async getDreamsByUser(userId: number): Promise<Dream[]> {
    return await db.select().from(dreams).where(eq(dreams.userId, userId));
  }

  async createDream(insertDream: InsertDream): Promise<Dream> {
    const [dream] = await db
      .insert(dreams)
      .values(insertDream)
      .returning();
    return dream;
  }

  async updateDream(id: number, updates: Partial<InsertDream>): Promise<Dream | undefined> {
    const [dream] = await db
      .update(dreams)
      .set(updates)
      .where(eq(dreams.id, id))
      .returning();
    return dream || undefined;
  }

  // Dream analysis operations
  async getDreamAnalysis(dreamId: number): Promise<DreamAnalysis | undefined> {
    const [analysis] = await db.select().from(dreamAnalyses).where(eq(dreamAnalyses.dreamId, dreamId));
    return analysis || undefined;
  }

  async createDreamAnalysis(insertAnalysis: InsertDreamAnalysis): Promise<DreamAnalysis> {
    const [analysis] = await db
      .insert(dreamAnalyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  // Dream NFT operations
  async getDreamNFT(id: number): Promise<DreamNFT | undefined> {
    const [nft] = await db.select().from(dreamNFTs).where(eq(dreamNFTs.id, id));
    return nft || undefined;
  }

  async getDreamNFTsByUser(userId: number): Promise<DreamNFT[]> {
    return await db.select().from(dreamNFTs).where(eq(dreamNFTs.userId, userId));
  }

  async getAllDreamNFTs(): Promise<DreamNFT[]> {
    return await db.select().from(dreamNFTs);
  }

  async createDreamNFT(insertNFT: InsertDreamNFT): Promise<DreamNFT> {
    const [nft] = await db
      .insert(dreamNFTs)
      .values(insertNFT)
      .returning();
    return nft;
  }

  // Sleep data operations
  async getSleepDataByUser(userId: number): Promise<SleepData[]> {
    return await db.select().from(sleepData).where(eq(sleepData.userId, userId));
  }

  async createSleepData(insertData: InsertSleepData): Promise<SleepData> {
    const [data] = await db
      .insert(sleepData)
      .values(insertData)
      .returning();
    return data;
  }

  // Mining rewards operations
  async getMiningRewardsByUser(userId: number): Promise<MiningReward[]> {
    return await db.select().from(miningRewards).where(eq(miningRewards.userId, userId));
  }

  async createMiningReward(insertReward: InsertMiningReward): Promise<MiningReward> {
    const [reward] = await db
      .insert(miningRewards)
      .values(insertReward)
      .returning();
    return reward;
  }
}

export const storage = new DatabaseStorage();
