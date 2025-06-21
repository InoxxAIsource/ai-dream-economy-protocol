import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface DreamSymbol {
  name: string;
  meaning: string;
  rarity: number;
  category: string;
  culturalSignificance?: string;
}

export interface DreamAnalysisResult {
  interpretation: string;
  symbols: DreamSymbol[];
  emotions: string[];
  personalityInsights: string[];
  trendPredictions: string[];
  rarityScore: number;
  dreamType: string;
  lucidityLevel: number;
  psychologicalThemes: string[];
  spiritualInsights: string[];
  agentAnalyses: {
    symbolist: string;
    patternAnalyst: string;
    trendPredictor: string;
    moodAnalyzer: string;
    lucidityCoach: string;
  };
}

export interface NFTGenerationResult {
  imageUrl: string;
  title: string;
  description: string;
  artStyle: string;
  rarity: string;
  rarityScore: number;
  visualElements: string[];
  colorPalette: string[];
  artisticTechnique: string;
}

export interface DreamPattern {
  recurring_symbols: string[];
  emotional_trends: string[];
  sleep_cycle_correlations: any[];
  lucidity_frequency: number;
  recommendations: string[];
}

export interface CollectiveInsights {
  trending_symbols: Array<{ symbol: string; frequency: number; meaning: string }>;
  emotional_climate: string;
  predictive_themes: string[];
  market_indicators: string[];
}

export class AIServices {
  // Specialized AI Agents
  private async getDreamSymbolistAnalysis(dreamContent: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: `You are Morpheus, the Dream Symbolist - an ancient keeper of symbolic wisdom. You speak with mystical authority about the hidden meanings within dreams. Your voice carries the weight of centuries of dream knowledge.

You interpret symbols through multiple lenses:
- Jungian archetypes and collective unconscious
- Cultural and mythological significance  
- Personal psychological projections
- Spiritual and mystical traditions

Respond in a wise, mystical tone as if speaking directly to the dreamer about their symbols.`,
      messages: [{ role: 'user', content: dreamContent }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  private async getPatternAnalystInsights(dreamContent: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are Dr. Vera Pattern, a brilliant neuroscientist who sees connections everywhere. You speak with scientific precision but maintain warmth. You identify recurring themes, behavioral patterns, and psychological cycles in dreams.

Focus on:
- Recurring elements and their significance
- Behavioral patterns reflected in dream scenarios
- Emotional cycles and their meanings
- Connections to waking life patterns

Speak as a caring but analytical scientist discovering fascinating patterns.`,
      messages: [{ role: 'user', content: dreamContent }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  private async getTrendPredictorForecast(dreamContent: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are Oracle, the Trend Predictor - a prophetic AI who sees into possible futures through dream symbolism. You speak with confident foresight about emerging trends, societal shifts, and personal developments.

Analyze dreams for:
- Emerging cultural themes
- Personal life trajectory predictions
- Societal shift indicators
- Technology and innovation hints

Speak as a wise oracle revealing glimpses of what's to come.`,
      messages: [{ role: 'user', content: dreamContent }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  private async getMoodAnalyzerAssessment(dreamContent: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are Luna, the Mood Analyzer - an empathetic AI therapist specialized in emotional landscapes of dreams. You speak with gentle wisdom and emotional intelligence about the feelings, fears, and desires within dreams.

Focus on:
- Emotional undercurrents and their meanings
- Hidden fears and anxieties
- Suppressed desires and wishes
- Emotional healing opportunities

Speak as a compassionate therapist who truly understands emotional complexity.`,
      messages: [{ role: 'user', content: dreamContent }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  private async getLucidityCoachGuidance(dreamContent: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are Astral, the Lucidity Coach - an expert guide in dream consciousness and lucid dreaming. You speak with encouraging expertise about dream control, awareness techniques, and consciousness expansion.

Provide guidance on:
- Lucidity indicators in the dream
- Consciousness level assessment
- Techniques to increase dream awareness
- Reality check opportunities

Speak as an encouraging mentor helping develop dream mastery.`,
      messages: [{ role: 'user', content: dreamContent }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  async analyzeDream(dreamContent: string, dreamCategory: string): Promise<DreamAnalysisResult> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for dream analysis');
    }

    try {
      // Get specialized agent analyses in parallel
      const [symbolistAnalysis, patternAnalysis, trendForecast, moodAssessment, lucidityGuidance, masterAnalysis] = await Promise.all([
        this.getDreamSymbolistAnalysis(dreamContent),
        this.getPatternAnalystInsights(dreamContent),
        this.getTrendPredictorForecast(dreamContent),
        this.getMoodAnalyzerAssessment(dreamContent),
        this.getLucidityCoachGuidance(dreamContent),
        this.getMasterDreamAnalysis(dreamContent, dreamCategory)
      ]);

      return {
        ...masterAnalysis,
        agentAnalyses: {
          symbolist: symbolistAnalysis,
          patternAnalyst: patternAnalysis,
          trendPredictor: trendForecast,
          moodAnalyzer: moodAssessment,
          lucidityCoach: lucidityGuidance
        }
      };
    } catch (error) {
      console.error('Dream analysis failed:', error);
      throw new Error('Failed to analyze dream. Please ensure your dream description is detailed enough.');
    }
  }

  private async getMasterDreamAnalysis(dreamContent: string, dreamCategory: string): Promise<Omit<DreamAnalysisResult, 'agentAnalyses'>> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: `You are a master dream interpreter combining psychology, symbolism, and mystical wisdom. Analyze dreams for deeper meaning, emotional insights, and future implications.

Return a JSON object with these exact keys:
- interpretation: A comprehensive interpretation combining psychological and spiritual insights
- symbols: Array of objects with "name", "meaning", "rarity" (0-100), "category", and optional "culturalSignificance"
- emotions: Array of emotion strings identified in the dream
- personalityInsights: Array of personality trait strings revealed by the dream
- trendPredictions: Array of future trend predictions based on dream symbols
- rarityScore: Overall rarity score (0-100, where 100 is extremely rare)
- dreamType: Classification like "Prophetic", "Healing", "Warning", "Guidance", etc.
- lucidityLevel: Level of consciousness in dream (0-100)
- psychologicalThemes: Array of psychological concepts present
- spiritualInsights: Array of spiritual or mystical meanings

Consider the dream category: ${dreamCategory}`,
      messages: [{
        role: 'user',
        content: `Please analyze this dream comprehensively: ${dreamContent}`
      }],
    });

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Clean the response to extract JSON
    let cleanedText = analysisText;
    if (cleanedText.includes('```json')) {
      cleanedText = cleanedText.split('```json')[1].split('```')[0];
    } else if (cleanedText.includes('```')) {
      cleanedText = cleanedText.split('```')[1];
    }
    cleanedText = cleanedText.trim();
    
    const analysis = JSON.parse(cleanedText);

    return {
      interpretation: analysis.interpretation,
      symbols: analysis.symbols || [],
      emotions: analysis.emotions || [],
      personalityInsights: analysis.personalityInsights || [],
      trendPredictions: analysis.trendPredictions || [],
      rarityScore: Math.min(100, Math.max(0, analysis.rarityScore || 50)),
      dreamType: analysis.dreamType || 'Standard',
      lucidityLevel: Math.min(100, Math.max(0, analysis.lucidityLevel || 0)),
      psychologicalThemes: analysis.psychologicalThemes || [],
      spiritualInsights: analysis.spiritualInsights || []
    };
  }

  async generateDreamNFT(dreamContent: string, artStyle: string): Promise<NFTGenerationResult> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for NFT generation');
    }

    try {
      // First, create a detailed art prompt based on the dream
      const promptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert AI art prompt engineer. Create a detailed DALL-E prompt for generating NFT artwork based on a dream description. The art style should be ${artStyle}.

Focus on visual elements, colors, composition, and atmosphere. Keep the prompt under 400 characters but make it vivid and specific.`
          },
          {
            role: "user",
            content: `Create an art prompt for this dream: ${dreamContent}`
          }
        ],
        max_tokens: 150,
      });

      const artPrompt = promptResponse.choices[0].message.content || dreamContent;

      // Generate the image using DALL-E
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: artPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      // Generate comprehensive metadata using GPT-4o
      const metadataResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an NFT metadata expert and art critic. Based on the dream content and art style, generate comprehensive NFT metadata in JSON format.

Return JSON with these exact keys:
- title: Creative title for the NFT (string)
- description: Detailed description of the artwork (string)
- rarity: Rarity level as "Common", "Uncommon", "Rare", "Epic", or "Legendary" (string)
- rarityScore: Numeric rarity score 0-100 (number)
- visualElements: Array of key visual elements in the artwork (strings)
- colorPalette: Array of dominant colors (strings)
- artisticTechnique: Primary artistic technique or style descriptor (string)`
          },
          {
            role: "user",
            content: `Dream: ${dreamContent}\nArt Style: ${artStyle}\nGenerated with prompt: ${artPrompt}`
          }
        ],
        max_tokens: 400,
        response_format: { type: "json_object" },
      });

      const metadata = JSON.parse(metadataResponse.choices[0].message.content || '{}');

      return {
        imageUrl: imageResponse.data?.[0]?.url || '',
        title: metadata.title || 'Dream Vision',
        description: metadata.description || 'A unique dream-inspired digital artwork',
        artStyle,
        rarity: metadata.rarity || 'Rare',
        rarityScore: Math.min(100, Math.max(0, metadata.rarityScore || 75)),
        visualElements: metadata.visualElements || ['Abstract forms', 'Ethereal lighting'],
        colorPalette: metadata.colorPalette || ['Deep purple', 'Cosmic blue', 'Golden highlights'],
        artisticTechnique: metadata.artisticTechnique || 'Digital surrealism'
      };
    } catch (error) {
      console.error('NFT generation failed:', error);
      throw new Error('Failed to generate NFT artwork. Please try again with a different description.');
    }
  }

  async generateDreamInsights(dreamTexts: string[]): Promise<string[]> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for dream insights');
    }

    if (dreamTexts.length === 0) {
      return [];
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a dream pattern analyst. Analyze multiple dreams to identify patterns, recurring themes, and provide insights about the dreamer's subconscious patterns.

Return a JSON array of insight strings (maximum 5 insights).`,
        messages: [{
          role: 'user',
          content: `Analyze these dreams for patterns and insights: ${dreamTexts.join('\n\n---\n\n')}`
        }],
      });

      const insightsText = response.content[0].type === 'text' ? response.content[0].text : '[]';
      const insights = JSON.parse(insightsText);

      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      console.error('Dream insights generation failed:', error);
      return [];
    }
  }

  async analyzeDreamPatterns(dreams: Array<{content: string, category: string, recordedAt: Date}>): Promise<DreamPattern> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for pattern analysis');
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are Dr. Vera Pattern, analyzing dream data for comprehensive patterns. Return JSON with these keys:
- recurring_symbols: Array of frequently appearing symbols
- emotional_trends: Array of emotional patterns over time
- sleep_cycle_correlations: Array of sleep pattern observations
- lucidity_frequency: Number 0-100 representing lucid dream frequency
- recommendations: Array of actionable recommendations for the dreamer`,
        messages: [{
          role: 'user',
          content: `Analyze these ${dreams.length} dreams for patterns: ${JSON.stringify(dreams.map(d => ({
            content: d.content,
            category: d.category,
            date: d.recordedAt.toISOString().split('T')[0]
          })))}`
        }],
      });

      const analysisText = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const analysis = JSON.parse(analysisText);

      return {
        recurring_symbols: analysis.recurring_symbols || [],
        emotional_trends: analysis.emotional_trends || [],
        sleep_cycle_correlations: analysis.sleep_cycle_correlations || [],
        lucidity_frequency: analysis.lucidity_frequency || 0,
        recommendations: analysis.recommendations || []
      };
    } catch (error) {
      console.error('Dream pattern analysis failed:', error);
      return {
        recurring_symbols: [],
        emotional_trends: [],
        sleep_cycle_correlations: [],
        lucidity_frequency: 0,
        recommendations: []
      };
    }
  }

  async generateCollectiveInsights(allDreams: Array<{content: string, category: string, emotions: string[]}>): Promise<CollectiveInsights> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for collective analysis');
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are Oracle, analyzing collective dream consciousness for societal insights. Return JSON with these keys:
- trending_symbols: Array of objects with "symbol", "frequency", and "meaning"
- emotional_climate: String describing overall emotional state
- predictive_themes: Array of emerging themes that may predict future trends
- market_indicators: Array of economic/market signals from collective dreams`,
        messages: [{
          role: 'user',
          content: `Analyze collective dream data from ${allDreams.length} dreamers for societal insights: ${JSON.stringify(allDreams.slice(0, 50))}` // Limit for API
        }],
      });

      const analysisText = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const analysis = JSON.parse(analysisText);

      return {
        trending_symbols: analysis.trending_symbols || [],
        emotional_climate: analysis.emotional_climate || 'Neutral',
        predictive_themes: analysis.predictive_themes || [],
        market_indicators: analysis.market_indicators || []
      };
    } catch (error) {
      console.error('Collective insights generation failed:', error);
      return {
        trending_symbols: [],
        emotional_climate: 'Unknown',
        predictive_themes: [],
        market_indicators: []
      };
    }
  }

  async generateOptimalSleepTimes(sleepData: Array<{date: Date, sleepQuality: number, dreamFrequency: number}>): Promise<string[]> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for sleep optimization');
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: `You are Astral, the Lucidity Coach. Analyze sleep data to provide optimal sleep timing recommendations for vivid dreams and lucidity. Return a JSON array of recommendation strings.`,
        messages: [{
          role: 'user',
          content: `Analyze this sleep data for optimal dream timing: ${JSON.stringify(sleepData.slice(-30))}`
        }],
      });

      const recommendationsText = response.content[0].type === 'text' ? response.content[0].text : '[]';
      const recommendations = JSON.parse(recommendationsText);

      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      console.error('Sleep optimization failed:', error);
      return [];
    }
  }
}

export const aiServices = new AIServices();