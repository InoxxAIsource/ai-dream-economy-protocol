import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { contractService } from "@/lib/contractService";
import { useAccount } from 'wagmi';
import { Plus, BookOpen, Mic, Save, Calendar, Clock, Moon, Eye, Heart, Lightbulb, Zap, Tag, Share, Lock, Coins } from "lucide-react";

const DreamJournal = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [dreamText, setDreamText] = useState("");
  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamCategory, setDreamCategory] = useState("");
  const [moodRating, setMoodRating] = useState([5]);
  const [clarityRating, setClarityRating] = useState([5]);
  const [vividnessRating, setVividnessRating] = useState([5]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dreamCategories = [
    { value: "lucid", label: "Lucid Dream", color: "from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)]" },
    { value: "nightmare", label: "Nightmare", color: "from-[hsl(0,84%,66%)] to-[hsl(15,82%,61%)]" },
    { value: "prophetic", label: "Prophetic", color: "from-[hsl(43,89%,56%)] to-[hsl(258,84%,66%)]" },
    { value: "recurring", label: "Recurring", color: "from-[hsl(325,84%,61%)] to-[hsl(215,82%,61%)]" },
    { value: "healing", label: "Healing", color: "from-[hsl(120,84%,66%)] to-[hsl(180,82%,61%)]" },
    { value: "adventure", label: "Adventure", color: "from-[hsl(30,84%,66%)] to-[hsl(60,82%,61%)]" }
  ];

  const commonTags = [
    "Flying", "Water", "Animals", "Family", "Work", "School", "Death", "Birth", 
    "Travel", "Food", "Colors", "Music", "Technology", "Nature", "Childhood"
  ];

  const moodEmojis = ["😴", "😟", "😐", "😊", "😍", "🤩", "✨", "🌟", "🚀", "👑"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording would be implemented here
  };

  const calculateDreamRewards = (category: string, vividness: number, clarity: number) => {
    const baseReward = 10; // Base DREAM tokens per dream submission
    const rarityMultipliers = {
      'lucid': 2.5,
      'prophetic': 7.5,
      'nightmare': 1.5,
      'recurring': 2.0,
      'healing': 4.0,
      'adventure': 1.5
    };
    
    const categoryMultiplier = rarityMultipliers[category as keyof typeof rarityMultipliers] || 1.0;
    const qualityBonus = ((vividness + clarity) / 20); // 0.0 to 1.0 bonus
    
    return Math.floor(baseReward * categoryMultiplier * (1 + qualityBonus));
  };

  const handleSubmitDream = async () => {
    if (!dreamText || !dreamTitle || !dreamCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit dreams and earn DREAM tokens",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate potential rewards
      const expectedReward = calculateDreamRewards(dreamCategory, vividnessRating[0], clarityRating[0]);
      
      // Submit dream to backend first
      const dreamData = {
        userId: 1, // Default user ID for now
        title: dreamTitle,
        content: dreamText,
        category: dreamCategory,
        moodRating: moodRating[0],
        clarityRating: clarityRating[0],
        vividnessRating: vividnessRating[0],
        tags: selectedTags,
        isPrivate
      };

      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dreamData)
      });

      if (!response.ok) {
        throw new Error('Failed to save dream');
      }

      const savedDream = await response.json();

      // Process blockchain reward if on BSC testnet
      const contractStatus = await contractService.verifyContracts();
      const contractsDeployed = Object.values(contractStatus).some(status => status);

      if (contractsDeployed) {
        // Award DREAM tokens via smart contract
        toast({
          title: "Dream Submitted Successfully!",
          description: `Processing ${expectedReward} DREAM tokens for your ${dreamCategory} dream...`,
        });

        try {
          // Execute real blockchain transaction to mint tokens
          const result = await contractService.transferDreamTokens(address, expectedReward.toString());
          console.log('Token transfer result:', result);
          
          toast({
            title: "Blockchain Reward Earned!",
            description: `${expectedReward} DREAM tokens transferred to your wallet. Transaction: ${result.transactionHash}`,
          });
        } catch (mintError) {
          console.error('Token minting failed:', mintError);
          toast({
            title: "Reward Processing",
            description: `Dream saved! ${expectedReward} DREAM tokens calculated. Connect wallet to claim rewards.`,
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Dream Saved",
          description: "Dream saved successfully. Connect to BSC testnet to earn DREAM token rewards!",
        });
      }

      // Reset form
      setDreamText("");
      setDreamTitle("");
      setDreamCategory("");
      setSelectedTags([]);
      setMoodRating([5]);
      setClarityRating([5]);
      setVividnessRating([5]);
      setShowNewEntry(false);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit dream",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showNewEntry) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold gradient-text">New Dream Entry</h1>
            <Button 
              variant="outline" 
              className="glass-card border-white/20 text-white hover:bg-white/20"
              onClick={() => setShowNewEntry(false)}
            >
              Back to Journal
            </Button>
          </div>

          <div className="space-y-6">
            {/* Dream Title & Category */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Moon className="mr-2 h-5 w-5" />
                  Dream Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Dream Title</Label>
                    <Input 
                      placeholder="Give your dream a title..."
                      value={dreamTitle}
                      onChange={(e) => setDreamTitle(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Category</Label>
                    <Select value={dreamCategory} onValueChange={setDreamCategory}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Select dream type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(252,67%,15%)] border-white/20">
                        {dreamCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dream Content */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Dream Description
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`glass-card border-white/20 text-white hover:bg-white/20 ${isRecording ? 'pulse-glow' : ''}`}
                    onClick={handleVoiceRecord}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    {isRecording ? 'Recording...' : 'Voice Input'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Describe your dream in detail... Include emotions, colors, people, places, and any symbols you remember."
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)] min-h-[200px]"
                />
              </CardContent>
            </Card>

            {/* Mood & Quality Ratings */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Dream Qualities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-gray-300 flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Emotional Mood
                    </Label>
                    <Slider
                      value={moodRating}
                      onValueChange={setMoodRating}
                      max={9}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-2xl mood-indicator">
                      {moodEmojis[moodRating[0]]}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-gray-300 flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      Clarity ({clarityRating[0]}/10)
                    </Label>
                    <Slider
                      value={clarityRating}
                      onValueChange={setClarityRating}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 text-center">
                      How clear was the dream?
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-gray-300 flex items-center">
                      <Zap className="mr-2 h-4 w-4" />
                      Vividness ({vividnessRating[0]}/10)
                    </Label>
                    <Slider
                      value={vividnessRating}
                      onValueChange={setVividnessRating}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 text-center">
                      How intense was the experience?
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags & Symbols */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Dream Tags & Symbols
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedTags.includes(tag) 
                          ? 'category-tag text-white' 
                          : 'border-white/30 text-gray-300 hover:border-white/50'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Input 
                  placeholder="Add custom tags (comma separated)..."
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)]"
                />
              </CardContent>
            </Card>

            {/* Privacy & Actions */}
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {isPrivate ? <Lock className="h-5 w-5 text-gray-400" /> : <Share className="h-5 w-5 text-[hsl(258,84%,66%)]" />}
                    <div>
                      <Label className="text-white font-medium">
                        {isPrivate ? 'Private Dream' : 'Shareable Dream'}
                      </Label>
                      <p className="text-sm text-gray-400">
                        {isPrivate ? 'Only you can see this dream' : 'Community can view for insights'}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={!isPrivate}
                    onCheckedChange={(checked) => setIsPrivate(!checked)}
                  />
                </div>
                
                {/* Blockchain Reward Preview */}
                {dreamCategory && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Coins className="h-6 w-6 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Blockchain Reward</p>
                          <p className="text-sm text-gray-300">
                            {calculateDreamRewards(dreamCategory, vividnessRating[0], clarityRating[0])} DREAM tokens
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        {dreamCategory.charAt(0).toUpperCase() + dreamCategory.slice(1)} Dream
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleSubmitDream}
                    disabled={isSubmitting || !dreamText || !dreamTitle || !dreamCategory}
                    className="flex-1 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] hover:from-[hsl(215,82%,61%)] hover:to-[hsl(325,84%,61%)] transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Coins className="mr-2 h-4 w-4" />
                        Submit & Earn DREAM
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    className="glass-card border-white/20 text-white hover:bg-white/20"
                    disabled={isSubmitting}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    AI Interpret
                  </Button>
                </div>
                
                {!isConnected && (
                  <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-300 text-center">
                      Connect your wallet to submit dreams and earn DREAM tokens on BSC testnet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Dream Journal</h1>
            <p className="text-gray-300 mt-2">Capture and explore your subconscious experiences</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] hover:from-[hsl(215,82%,61%)] hover:to-[hsl(325,84%,61%)] transition-all duration-300"
            onClick={() => setShowNewEntry(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-4 text-[hsl(258,84%,66%)]" />
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Dreams This Month</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-4 text-[hsl(215,82%,61%)]" />
              <div className="text-2xl font-bold text-white">--</div>
              <div className="text-sm text-gray-400">Avg Dream Length</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-4 text-[hsl(43,89%,56%)]" />
              <div className="text-2xl font-bold text-white">--</div>
              <div className="text-sm text-gray-400">Lucid Dreams</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Empty State */}
        <Card className="glass-card border-white/10">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] rounded-full flex items-center justify-center mx-auto mb-6 opacity-70 floating">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">No dreams recorded</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Start your first dream journal entry to begin your journey into the dream economy. Record dreams immediately upon waking for the most vivid memories.
            </p>
            <Button 
              className="bg-gradient-to-r from-[hsl(325,84%,61%)] to-[hsl(43,89%,56%)] hover:scale-105 transition-transform duration-200"
              onClick={() => setShowNewEntry(true)}
            >
              Record Your First Dream
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DreamJournal;
