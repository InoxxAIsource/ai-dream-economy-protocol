import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { contractService } from "@/lib/contractService";
import { useAccount } from 'wagmi';
import { Filter, ArrowUpDown, Palette, Wand2, Eye, Heart, Share, Wallet, Star, Search, Image, Coins, ShoppingCart } from "lucide-react";

const NFTMarketplace = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  
  const [showCreationFlow, setShowCreationFlow] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [generationStep, setGenerationStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [contractsDeployed, setContractsDeployed] = useState(false);
  const [dreamContent, setDreamContent] = useState("");
  const [nftTitle, setNftTitle] = useState("");

  useEffect(() => {
    checkContractStatus();
  }, []);

  const checkContractStatus = async () => {
    try {
      const contractStatus = await contractService.verifyContracts();
      const deployed = Object.values(contractStatus).some(status => status);
      setContractsDeployed(deployed);
    } catch (error) {
      console.error('Error checking contracts:', error);
    }
  };

  const handleMintNFT = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive"
      });
      return;
    }

    if (!contractsDeployed) {
      toast({
        title: "Contracts Not Available",
        description: "Smart contracts are not deployed on this network",
        variant: "destructive"
      });
      return;
    }

    if (!dreamContent || !nftTitle || !selectedStyle) {
      toast({
        title: "Missing Information",
        description: "Please provide dream content, title, and select an art style",
        variant: "destructive"
      });
      return;
    }

    setIsMinting(true);

    try {
      // Generate NFT using AI services
      toast({
        title: "Creating Your Dream NFT",
        description: "AI is generating artwork from your dream...",
      });

      const nftResult = await fetch('/api/nft/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dreamContent,
          artStyle: selectedStyle,
          title: nftTitle
        })
      });

      if (!nftResult.ok) {
        throw new Error('Failed to generate NFT artwork');
      }

      const nftData = await nftResult.json();

      // Mint NFT on blockchain
      toast({
        title: "Minting NFT on Blockchain",
        description: "Creating your NFT on BSC testnet...",
      });

      await contractService.mintDreamNFT(address, nftData.tokenURI);

      toast({
        title: "NFT Minted Successfully!",
        description: `Your "${nftTitle}" NFT has been created and added to your collection`,
      });

      // Reset form
      setDreamContent("");
      setNftTitle("");
      setSelectedStyle("");
      setGenerationStep(0);
      setShowCreationFlow(false);

    } catch (error) {
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint NFT",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  const artStyles = [
    { 
      id: "surreal", 
      name: "Surreal", 
      description: "Dreamlike, impossible landscapes",
      example: "Abstract floating objects in ethereal space",
      gradient: "from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)]"
    },
    { 
      id: "abstract", 
      name: "Abstract", 
      description: "Emotion expressed through color and form",
      example: "Flowing colors representing dream emotions",
      gradient: "from-[hsl(215,82%,61%)] to-[hsl(325,84%,61%)]"
    },
    { 
      id: "photorealistic", 
      name: "Photorealistic", 
      description: "Vivid, lifelike dream scenes",
      example: "Crystal clear dream environments",
      gradient: "from-[hsl(325,84%,61%)] to-[hsl(43,89%,56%)]"
    },
    { 
      id: "mystical", 
      name: "Mystical", 
      description: "Spiritual and otherworldly imagery",
      example: "Sacred geometry and divine light",
      gradient: "from-[hsl(43,89%,56%)] to-[hsl(258,84%,66%)]"
    }
  ];

  const sampleNFTs = [
    {
      id: 1,
      title: "Flight of the Cosmic Whale",
      creator: "DreamWeaver_42",
      price: "2.5 ETH",
      rarity: "Epic",
      style: "Surreal",
      likes: 127,
      views: 1850,
      rarityScore: 89
    },
    {
      id: 2,
      title: "Memories in Blue",
      creator: "NightVisions",
      price: "1.8 ETH",
      rarity: "Rare",
      style: "Abstract",
      likes: 89,
      views: 1234,
      rarityScore: 76
    },
    {
      id: 3,
      title: "The Last Dream",
      creator: "SleepArtist",
      price: "3.2 ETH",
      rarity: "Legendary",
      style: "Mystical",
      likes: 203,
      views: 2891,
      rarityScore: 95
    }
  ];

  const generationSteps = [
    "Analyzing dream content...",
    "Selecting optimal art style...",
    "Generating visual elements...",
    "Applying dream symbolism...",
    "Finalizing NFT artwork..."
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-[hsl(43,89%,56%)]";
      case "Epic": return "text-[hsl(325,84%,61%)]";
      case "Rare": return "text-[hsl(258,84%,66%)]";
      case "Uncommon": return "text-[hsl(215,82%,61%)]";
      default: return "text-gray-400";
    }
  };

  if (showCreationFlow && generationStep > 0) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">Creating Dream NFT</h1>
          
          <Card className="glass-card border-white/10">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(325,84%,61%)] rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Wand2 className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                {generationSteps[Math.min(generationStep - 1, generationSteps.length - 1)]}
              </h3>
              <p className="text-gray-300 mb-6">
                AI is transforming your dream into a unique digital artwork
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress</span>
                  <span>{Math.min(generationStep * 20, 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(325,84%,61%)] h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(generationStep * 20, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showCreationFlow) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold gradient-text">Create Dream NFT</h1>
            <Button 
              variant="outline" 
              className="glass-card border-white/20 text-white hover:bg-white/20"
              onClick={() => setShowCreationFlow(false)}
            >
              Back to Marketplace
            </Button>
          </div>

          <Card className="glass-card border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Choose Art Style</CardTitle>
              <p className="text-gray-400">Select how you want your dream to be visualized</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {artStyles.map((style) => (
                  <Card 
                    key={style.id}
                    className={`glass-card cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedStyle === style.id 
                        ? 'border-[hsl(258,84%,66%)] dream-glow' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-full h-32 bg-gradient-to-r ${style.gradient} rounded-lg mb-4 flex items-center justify-center`}>
                        <Image className="h-12 w-12 text-white opacity-80" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{style.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{style.description}</p>
                      <p className="text-xs text-gray-500">{style.example}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Dream Source</CardTitle>
              <p className="text-gray-400">Use a dream from your journal or paste new content</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select from your dreams" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(252,67%,15%)] border-white/20">
                  <SelectItem value="none" className="text-gray-400">No dreams available</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-center text-gray-400">or</div>
              
              <textarea 
                placeholder="Paste dream content here..."
                className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)] focus:outline-none"
              />
              
              <Button 
                className="w-full bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(325,84%,61%)] hover:scale-105 transition-transform duration-200"
                disabled={!selectedStyle}
                onClick={() => {
                  setGenerationStep(1);
                  const interval = setInterval(() => {
                    setGenerationStep(prev => {
                      if (prev >= 5) {
                        clearInterval(interval);
                        setTimeout(() => {
                          setShowCreationFlow(false);
                          setGenerationStep(0);
                        }, 2000);
                        return prev;
                      }
                      return prev + 1;
                    });
                  }, 1500);
                }}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Dream NFT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Dream NFT Marketplace</h1>
            <p className="text-gray-300">Discover and trade unique dream-inspired digital art</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(325,84%,61%)] hover:scale-105 transition-transform duration-200"
            onClick={() => setShowCreationFlow(true)}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Create NFT
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search dream NFTs..."
                className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)]"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Select>
              <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(252,67%,15%)] border-white/20">
                <SelectItem value="all" className="text-white">All Rarities</SelectItem>
                <SelectItem value="legendary" className="text-white">Legendary</SelectItem>
                <SelectItem value="epic" className="text-white">Epic</SelectItem>
                <SelectItem value="rare" className="text-white">Rare</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="glass-card border-white/20 text-white hover:bg-white/20">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="glass-card border-white/20 text-white hover:bg-white/20">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass-card border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All NFTs</TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-white/20">Trending</TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-white/20">Recent</TabsTrigger>
            <TabsTrigger value="mine" className="data-[state=active]:bg-white/20">My Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {sampleNFTs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleNFTs.map((nft) => (
                  <Card key={nft.id} className="glass-card border-white/10 hover:border-[hsl(258,84%,66%)] transition-all duration-200 group">
                    <div className="aspect-square bg-gradient-to-br from-[hsl(258,84%,66%)] to-[hsl(325,84%,61%)] rounded-t-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Palette className="h-16 w-16 text-white opacity-50" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getRarityColor(nft.rarity)} bg-black/50`}>
                          {nft.rarity}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[hsl(258,84%,66%)] transition-colors">
                        {nft.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">by {nft.creator}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-white font-semibold">{nft.price}</div>
                        <div className="flex items-center space-x-3 text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span className="text-xs">{nft.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">{nft.views}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)]">
                          <Wallet className="mr-2 h-3 w-3" />
                          Buy Now
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-[hsl(43,89%,56%)] to-[hsl(325,84%,61%)] rounded-full flex items-center justify-center mx-auto mb-6 opacity-70 floating">
                    <Palette className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">No dream NFTs available</h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Be the first to create and mint dream-inspired NFTs on the marketplace
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-[hsl(43,89%,56%)] to-[hsl(325,84%,61%)] hover:scale-105 transition-transform duration-200"
                    onClick={() => setShowCreationFlow(true)}
                  >
                    Create Your First NFT
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <Card className="glass-card border-white/10">
              <CardContent className="p-12 text-center">
                <Star className="h-16 w-16 mx-auto mb-4 text-[hsl(43,89%,56%)] opacity-70" />
                <h3 className="text-xl font-semibold text-white mb-2">No trending NFTs yet</h3>
                <p className="text-gray-400">Check back when the marketplace becomes more active</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="glass-card border-white/10">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-[hsl(215,82%,61%)] opacity-70 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No recent NFTs</h3>
                <p className="text-gray-400">New dream NFTs will appear here as they're created</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mine">
            <Card className="glass-card border-white/10">
              <CardContent className="p-12 text-center">
                <Wallet className="h-16 w-16 mx-auto mb-4 text-[hsl(258,84%,66%)] opacity-70" />
                <h3 className="text-xl font-semibold text-white mb-2">No NFTs in your collection</h3>
                <p className="text-gray-400">Create or purchase dream NFTs to build your collection</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NFTMarketplace;
