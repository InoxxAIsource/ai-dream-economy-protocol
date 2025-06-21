import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiServices } from "./ai-services";
import { insertDreamSchema, insertDreamAnalysisSchema, insertDreamNFTSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dream routes
  app.post("/api/dreams", async (req, res) => {
    try {
      console.log('Received dream data:', req.body);
      
      // Ensure default user exists
      let user = await storage.getUserByUsername('default');
      if (!user) {
        user = await storage.createUser({
          username: 'default',
          password: 'temp',
          displayName: 'Dream User'
        });
      }
      
      // Use the user's ID for the dream
      const dreamDataWithUser = { ...req.body, userId: user.id };
      const dreamData = insertDreamSchema.parse(dreamDataWithUser);
      const dream = await storage.createDream(dreamData);
      
      // Auto-generate AI analysis for the dream
      try {
        const analysis = await aiServices.analyzeDream(dream.content, dream.category);
        const analysisData = {
          dreamId: dream.id,
          interpretation: analysis.interpretation,
          symbols: JSON.stringify(analysis.symbols),
          emotions: analysis.emotions,
          personalityInsights: analysis.personalityInsights,
          trendPredictions: analysis.trendPredictions,
          rarityScore: analysis.rarityScore,
          dreamType: analysis.dreamType,
          lucidityLevel: analysis.lucidityLevel,
          psychologicalThemes: analysis.psychologicalThemes,
          spiritualInsights: analysis.spiritualInsights,
          agentAnalyses: JSON.stringify(analysis.agentAnalyses)
        };
        
        await storage.createDreamAnalysis(analysisData);
      } catch (analysisError) {
        console.log('Analysis generation failed, dream saved without analysis:', analysisError);
      }

      // Create mining reward entry
      try {
        const rewardAmount = calculateDreamReward(dream);
        await storage.createMiningReward({
          userId: dream.userId,
          dreamId: dream.id,
          activity: 'dream_submission',
          amount: rewardAmount.toString(),
          currency: 'DREAM',
          description: `Reward for submitting dream: ${dream.title}`
        });
      } catch (rewardError) {
        console.log('Mining reward creation failed:', rewardError);
      }
      
      res.json({ dream, expectedReward: calculateDreamReward(dream) });
    } catch (error) {
      console.error('Dream creation error:', error);
      res.status(400).json({ error: "Invalid dream data", details: error });
    }
  });

  // Blockchain reward calculation helper
  function calculateDreamReward(dream: any): number {
    const baseReward = 10;
    const rarityMultipliers: { [key: string]: number } = {
      'lucid': 2.5,
      'prophetic': 7.5,
      'nightmare': 1.5,
      'recurring': 2.0,
      'healing': 4.0,
      'adventure': 1.5
    };
    
    const categoryMultiplier = rarityMultipliers[dream.category] || 1.0;
    const qualityBonus = ((dream.vividnessRating + dream.clarityRating) / 20);
    
    return Math.floor(baseReward * categoryMultiplier * (1 + qualityBonus));
  }

  // Blockchain reward endpoint - server-controlled minting
  app.post("/api/dreams/:id/claim-reward", async (req, res) => {
    try {
      const rewardId = parseInt(req.params.id);
      const { walletAddress, amount } = req.body;
      
      if (!walletAddress || !amount) {
        return res.status(400).json({ error: "Wallet address and amount required" });
      }

      // Get the mining reward to verify it exists and hasn't been claimed
      const reward = await storage.getMiningRewardsByUser(1);
      const targetReward = reward.find(r => r.id === rewardId);
      
      if (!targetReward) {
        return res.status(404).json({ error: "Reward not found" });
      }

      // In production, this would use a server-side wallet/private key to call the smart contract
      // For now, simulate successful blockchain transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      console.log(`Processing reward claim: ${amount} DREAM tokens to ${walletAddress}`);
      console.log(`Simulated transaction hash: ${transactionHash}`);
      
      // Update reward status in database (add a claimed field)
      // For now, just return success
      
      res.json({ 
        success: true, 
        amount,
        walletAddress,
        transactionHash,
        message: `${amount} DREAM tokens minted to ${walletAddress}`,
        blockExplorer: `https://testnet.bscscan.com/tx/${transactionHash}`
      });
    } catch (error) {
      console.error('Reward claim error:', error);
      res.status(500).json({ error: "Failed to process reward claim" });
    }
  });

  app.get("/api/dreams/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dreams = await storage.getDreamsByUser(userId);
      res.json(dreams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dreams" });
    }
  });

  // Direct dream analysis route (for new content)
  app.post("/api/dreams/analyze", async (req, res) => {
    try {
      const { content, category } = req.body;
      
      if (!content || !category) {
        return res.status(400).json({ error: "Dream content and category are required" });
      }

      const analysis = await aiServices.analyzeDream(content, category);
      res.json(analysis);
    } catch (error: unknown) {
      console.error('Dream analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('ANTHROPIC_API_KEY')) {
        return res.status(400).json({ error: "AI service not configured. Please provide API keys." });
      }
      res.status(500).json({ error: errorMessage || "Failed to analyze dream" });
    }
  });

  // AI Dream Analysis route for existing dreams
  app.post("/api/dreams/:dreamId/analyze", async (req, res) => {
    try {
      const dreamId = parseInt(req.params.dreamId);
      const dream = await storage.getDream(dreamId);
      
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      const analysis = await aiServices.analyzeDream(dream.content, dream.category);
      
      const savedAnalysis = await storage.createDreamAnalysis({
        dreamId,
        interpretation: analysis.interpretation,
        symbols: analysis.symbols,
        emotions: analysis.emotions,
        personalityInsights: analysis.personalityInsights,
        trendPredictions: analysis.trendPredictions,
        rarityScore: analysis.rarityScore
      });

      res.json(savedAnalysis);
    } catch (error: unknown) {
      console.error('Dream analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('ANTHROPIC_API_KEY')) {
        return res.status(400).json({ error: "AI service not configured. Please provide API keys." });
      }
      res.status(500).json({ error: errorMessage || "Failed to analyze dream" });
    }
  });

  app.get("/api/dreams/:dreamId/analysis", async (req, res) => {
    try {
      const dreamId = parseInt(req.params.dreamId);
      const analysis = await storage.getDreamAnalysis(dreamId);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  });

  // AI NFT Generation route
  app.post("/api/dreams/:dreamId/generate-nft", async (req, res) => {
    try {
      const dreamId = parseInt(req.params.dreamId);
      const { artStyle, userId } = req.body;
      
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      const nftResult = await aiServices.generateDreamNFT(dream.content, artStyle);
      
      const savedNFT = await storage.createDreamNFT({
        dreamId,
        userId,
        title: nftResult.title,
        artStyle: nftResult.artStyle,
        rarity: nftResult.rarity,
        rarityScore: nftResult.rarityScore,
        isMinted: false
      });

      res.json({
        ...savedNFT,
        imageUrl: nftResult.imageUrl,
        description: nftResult.description
      });
    } catch (error: unknown) {
      console.error('NFT generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('OPENAI_API_KEY')) {
        return res.status(400).json({ error: "AI service not configured. Please provide API keys." });
      }
      res.status(500).json({ error: errorMessage || "Failed to generate NFT" });
    }
  });

  // Direct NFT generation from dream content
  app.post("/api/nft/generate", async (req, res) => {
    try {
      const { dreamContent, artStyle, title } = req.body;
      
      if (!dreamContent || !artStyle || !title) {
        return res.status(400).json({ error: "Dream content, art style, and title are required" });
      }

      const nftResult = await aiServices.generateDreamNFT(dreamContent, artStyle);
      
      // Create metadata for blockchain minting
      const tokenURI = {
        name: title,
        description: nftResult.description,
        image: nftResult.imageUrl,
        attributes: [
          { trait_type: "Art Style", value: nftResult.artStyle },
          { trait_type: "Rarity", value: nftResult.rarity },
          { trait_type: "Rarity Score", value: nftResult.rarityScore },
          { trait_type: "Dream Category", value: "Generated" }
        ]
      };

      res.json({
        ...nftResult,
        tokenURI: JSON.stringify(tokenURI)
      });
    } catch (error: unknown) {
      console.error('NFT generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('OPENAI_API_KEY')) {
        return res.status(400).json({ error: "AI service not configured. Please provide API keys." });
      }
      res.status(500).json({ error: errorMessage || "Failed to generate NFT" });
    }
  });

  // NFT routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const nfts = await storage.getAllDreamNFTs();
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });

  app.get("/api/nfts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const nfts = await storage.getDreamNFTsByUser(userId);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user NFTs" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Sleep data routes
  app.get("/api/sleep-data/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sleepData = await storage.getSleepDataByUser(userId);
      res.json(sleepData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sleep data" });
    }
  });

  // Mining rewards routes
  app.get("/api/mining-rewards", async (req, res) => {
    try {
      // For now, get rewards for user ID 1 (the current user)
      const userId = 1;
      let rewards = await storage.getMiningRewardsByUser(userId);
      
      // If no rewards exist, backfill from existing dreams
      if (rewards.length === 0) {
        console.log('No mining rewards found, starting backfill process...');
        const dreams = await storage.getDreamsByUser(userId);
        console.log(`Found ${dreams.length} dreams to backfill`);
        
        for (const dream of dreams) {
          try {
            const rewardAmount = calculateDreamReward(dream);
            console.log(`Creating reward for dream ${dream.id}: ${rewardAmount} DREAM`);
            await storage.createMiningReward({
              userId: dream.userId,
              dreamId: dream.id,
              activity: 'dream_submission',
              amount: rewardAmount.toString(),
              currency: 'DREAM',
              description: `Reward for submitting dream: ${dream.title}`
            });
          } catch (error) {
            console.error(`Failed to create reward for dream ${dream.id}:`, error);
          }
        }
        // Refresh rewards after backfill
        rewards = await storage.getMiningRewardsByUser(userId);
        console.log(`After backfill: ${rewards.length} rewards created`);
      }
      
      // Enrich rewards with dream details
      const enrichedRewards = await Promise.all(rewards.map(async (reward) => {
        if (!reward.dreamId) return reward;
        const dream = await storage.getDream(reward.dreamId);
        return {
          ...reward,
          dreamTitle: dream?.title || 'Unknown Dream',
          category: dream?.category || 'unknown',
          submittedAt: dream?.recordedAt || reward.createdAt,
          tokensEarned: parseFloat(reward.amount),
          rarityScore: 75 // Default rarity score
        };
      }));
      
      res.json(enrichedRewards);
    } catch (error) {
      console.error('Mining rewards error:', error);
      res.status(500).json({ error: "Failed to fetch mining rewards" });
    }
  });

  app.get("/api/mining-rewards/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rewards = await storage.getMiningRewardsByUser(userId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mining rewards" });
    }
  });

  app.post("/api/mining-rewards", async (req, res) => {
    try {
      const rewardData = req.body;
      const reward = await storage.createMiningReward(rewardData);
      res.json(reward);
    } catch (error) {
      res.status(500).json({ error: "Failed to create mining reward" });
    }
  });

  // Dream insights route
  app.get("/api/dreams/insights/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dreams = await storage.getDreamsByUser(userId);
      const dreamTexts = dreams.map(d => d.content);
      const insights = await aiServices.generateDreamInsights(dreamTexts);
      res.json(insights);
    } catch (error) {
      console.error('Dream insights error:', error);
      res.status(500).json({ error: "Failed to generate dream insights" });
    }
  });

  // Advanced AI routes
  app.get("/api/dreams/patterns/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dreams = await storage.getDreamsByUser(userId);
      const filteredDreams = dreams
        .filter(d => d.recordedAt !== null)
        .map(d => ({
          content: d.content,
          category: d.category,
          recordedAt: d.recordedAt!
        }));
      const patterns = await aiServices.analyzeDreamPatterns(filteredDreams);
      res.json(patterns);
    } catch (error) {
      console.error('Dream pattern analysis error:', error);
      res.status(500).json({ error: "Failed to analyze dream patterns" });
    }
  });

  app.get("/api/collective/insights", async (req, res) => {
    try {
      const allNFTs = await storage.getAllDreamNFTs();
      const dreamsData = await Promise.all(
        allNFTs.slice(0, 100).map(async (nft) => {
          const dream = await storage.getDream(nft.dreamId);
          const analysis = await storage.getDreamAnalysis(nft.dreamId);
          return {
            content: dream?.content || '',
            category: dream?.category || 'unknown',
            emotions: analysis?.emotions || []
          };
        })
      );
      
      const insights = await aiServices.generateCollectiveInsights(dreamsData);
      res.json(insights);
    } catch (error) {
      console.error('Collective insights error:', error);
      res.status(500).json({ error: "Failed to generate collective insights" });
    }
  });

  app.get("/api/sleep/optimization/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sleepData = await storage.getSleepDataByUser(userId);
      const filteredSleepData = sleepData
        .filter(d => d.sleepQuality !== null && d.dreamFrequency !== null)
        .map(d => ({
          date: d.date,
          sleepQuality: d.sleepQuality!,
          dreamFrequency: d.dreamFrequency!
        }));
      const recommendations = await aiServices.generateOptimalSleepTimes(filteredSleepData);
      res.json(recommendations);
    } catch (error) {
      console.error('Sleep optimization error:', error);
      res.status(500).json({ error: "Failed to generate sleep optimization" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
