import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Brain, Lightbulb, TrendingUp, Star, Eye, AlertCircle, Wand2, Users, Target, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DreamSymbol {
  name: string;
  meaning: string;
  rarity: number;
  category: string;
  culturalSignificance?: string;
}

interface DreamAnalysis {
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

const AIInterpreter = () => {
  const [dreamText, setDreamText] = useState("");
  const [dreamCategory, setDreamCategory] = useState("standard");
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeDreamMutation = useMutation({
    mutationFn: async (dreamData: { content: string; category: string }): Promise<DreamAnalysis> => {
      const response = await fetch('/api/dreams/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dreamData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      setIsAnalyzing(false);
      toast({
        title: "Dream Analysis Complete",
        description: "Your dream has been interpreted by our AI specialists"
      });
    },
    onError: (error: any) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: error?.message || "Unable to analyze dream. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAnalyzeDream = async () => {
    if (!dreamText.trim()) {
      toast({
        title: "Dream Required",
        description: "Please enter your dream description to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysis(null);
    analyzeDreamMutation.mutate({
      content: dreamText,
      category: dreamCategory
    });
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setDreamText("");
    setDreamCategory("standard");
  };

  const getRarityColor = (score: number) => {
    if (score >= 90) return "text-[hsl(43,89%,56%)]"; // Gold - Legendary
    if (score >= 80) return "text-[hsl(325,84%,61%)]"; // Pink - Epic
    if (score >= 70) return "text-[hsl(258,84%,66%)]"; // Purple - Rare
    if (score >= 50) return "text-[hsl(215,82%,61%)]"; // Blue - Uncommon
    return "text-gray-400"; // Common
  };

  const getRarityLabel = (score: number) => {
    if (score >= 90) return "Legendary";
    if (score >= 80) return "Epic";
    if (score >= 70) return "Rare";
    if (score >= 50) return "Uncommon";
    return "Common";
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'symbolist': return <Sparkles className="h-5 w-5" />;
      case 'patternAnalyst': return <Target className="h-5 w-5" />;
      case 'trendPredictor': return <TrendingUp className="h-5 w-5" />;
      case 'moodAnalyzer': return <Heart className="h-5 w-5" />;
      case 'lucidityCoach': return <Eye className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getAgentName = (agentType: string) => {
    switch (agentType) {
      case 'symbolist': return "Morpheus - Dream Symbolist";
      case 'patternAnalyst': return "Dr. Vera Pattern - Pattern Analyst";
      case 'trendPredictor': return "Oracle - Trend Predictor";
      case 'moodAnalyzer': return "Luna - Mood Analyzer";
      case 'lucidityCoach': return "Astral - Lucidity Coach";
      default: return "AI Agent";
    }
  };

  if (isAnalyzing) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">AI Dream Interpreter</h1>
          
          <Card className="glass-card border-white/10">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Brain className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Analyzing Your Dream...</h3>
              <p className="text-gray-300 mb-6">
                Our specialized AI agents are analyzing your dream through multiple lenses of interpretation
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Processing symbols and patterns...</span>
                  <span>Analyzing</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500 mt-4">
                  Morpheus • Dr. Vera Pattern • Oracle • Luna • Astral
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold gradient-text">Dream Analysis Complete</h1>
            <div className="flex items-center gap-2">
              <Badge className={`${getRarityColor(analysis.rarityScore)} bg-white/10 border-white/20`}>
                {getRarityLabel(analysis.rarityScore)} • {analysis.rarityScore}/100
              </Badge>
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                New Analysis
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Analysis */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5" />
                    Master Interpretation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{analysis.interpretation}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <span>Dream Type: {analysis.dreamType}</span>
                    <span>•</span>
                    <span>Lucidity Level: {analysis.lucidityLevel}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Specialized Agent Analyses */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    Specialist Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="symbolist" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-white/5">
                      {Object.entries(analysis.agentAnalyses).map(([key, _]) => (
                        <TabsTrigger key={key} value={key} className="text-xs">
                          {getAgentIcon(key)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(analysis.agentAnalyses).map(([key, analysis_text]) => (
                      <TabsContent key={key} value={key} className="mt-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            {getAgentIcon(key)}
                            {getAgentName(key)}
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{analysis_text}</p>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Details */}
            <div className="space-y-6">
              {/* Dream Symbols */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5" />
                    Dream Symbols
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.symbols.map((symbol, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{symbol.name}</h4>
                          <Badge variant="outline" className={`text-xs ${getRarityColor(symbol.rarity)}`}>
                            {symbol.rarity}%
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs">{symbol.meaning}</p>
                        <p className="text-gray-500 text-xs mt-1">Category: {symbol.category}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emotions */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Heart className="h-5 w-5" />
                    Emotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotions.map((emotion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personality Insights */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="h-5 w-5" />
                    Personality Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.personalityInsights.map((insight, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Trend Predictions */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    Future Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.trendPredictions.map((prediction, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <TrendingUp className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                        {prediction}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">AI Dream Interpreter</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock the mysteries of your subconscious with our specialized AI agents
          </p>
        </div>

        <Card className="glass-card border-white/10 mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dream Category
                </label>
                <Select value={dreamCategory} onValueChange={setDreamCategory}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select dream category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Dream</SelectItem>
                    <SelectItem value="lucid">Lucid Dream</SelectItem>
                    <SelectItem value="nightmare">Nightmare</SelectItem>
                    <SelectItem value="prophetic">Prophetic Dream</SelectItem>
                    <SelectItem value="recurring">Recurring Dream</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe Your Dream
                </label>
                <Textarea
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  placeholder="I was flying over a vast ocean, and I could see strange lights beneath the waves. The sky was filled with stars that seemed to be singing..."
                  className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-gray-500 resize-none"
                  rows={6}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {dreamText.length}/500 characters
                </div>
              </div>

              <Button
                onClick={handleAnalyzeDream}
                disabled={!dreamText.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] hover:from-[hsl(258,84%,76%)] hover:to-[hsl(215,82%,71%)] text-white font-semibold py-3"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Analyze Dream with AI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Specialists Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Morpheus", title: "Dream Symbolist", icon: <Sparkles className="h-5 w-5" />, desc: "Ancient keeper of symbolic wisdom" },
            { name: "Dr. Vera Pattern", title: "Pattern Analyst", icon: <Target className="h-5 w-5" />, desc: "Neuroscientist who sees connections" },
            { name: "Oracle", title: "Trend Predictor", icon: <TrendingUp className="h-5 w-5" />, desc: "Prophetic AI seeing future trends" },
            { name: "Luna", title: "Mood Analyzer", icon: <Heart className="h-5 w-5" />, desc: "Empathetic emotional landscape expert" },
            { name: "Astral", title: "Lucidity Coach", icon: <Eye className="h-5 w-5" />, desc: "Guide to dream consciousness" }
          ].map((agent, index) => (
            <Card key={index} className="glass-card border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] rounded-full flex items-center justify-center">
                  {agent.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                  <p className="text-gray-400 text-xs">{agent.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{agent.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInterpreter;