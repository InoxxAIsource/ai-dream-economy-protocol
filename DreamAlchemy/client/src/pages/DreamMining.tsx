import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { contractService } from "@/lib/contractService";
import { useAccount } from 'wagmi';
import { Wallet, Zap, TrendingUp, Coins, Palette, Crown, Trophy, Users, Star, ArrowUp, Clock, Target, Lightbulb, Lock } from "lucide-react";

const DreamMining = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  
  const [contractsDeployed, setContractsDeployed] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [stakingData, setStakingData] = useState({
    stakedAmount: "0",
    pendingRewards: "0",
    apy: "15"
  });

  useEffect(() => {
    checkContractStatus();
    if (isConnected && address) {
      fetchStakingData();
    }
  }, [isConnected, address]);

  const checkContractStatus = async () => {
    try {
      const contractStatus = await contractService.verifyContracts();
      const deployed = Object.values(contractStatus).some(status => status);
      setContractsDeployed(deployed);
    } catch (error) {
      console.error('Error checking contracts:', error);
    }
  };

  const fetchStakingData = async () => {
    if (!address || !contractsDeployed) return;
    
    try {
      const stakeInfo = await contractService.getStakeInfo(address);
      const pendingRewards = await contractService.getPendingRewards(address);
      const apy = await contractService.getAPY();
      
      setStakingData({
        stakedAmount: stakeInfo.amount,
        pendingRewards,
        apy: apy.toString()
      });
    } catch (error) {
      console.error('Error fetching staking data:', error);
    }
  };

  const handleStake = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to stake DREAM tokens",
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

    if (!stakeAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount to stake",
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);

    try {
      await contractService.stakeDreamTokens(stakeAmount);
      
      toast({
        title: "Staking Successful",
        description: `Staked ${stakeAmount} DREAM tokens. Earning 15% APY!`,
      });

      await fetchStakingData();
      setStakeAmount("");
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive"
      });
      return;
    }

    try {
      await contractService.claimStakingRewards();
      
      toast({
        title: "Rewards Claimed",
        description: `Claimed ${stakingData.pendingRewards} DREAM tokens`,
      });

      await fetchStakingData();
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive"
      });
    }
  };

  const stats = [
    {
      title: "Staked DREAM",
      value: `${parseFloat(stakingData.stakedAmount).toFixed(2)}`,
      subtitle: "Tokens staked",
      icon: Lock,
      color: "text-[hsl(258,84%,66%)]"
    },
    {
      title: "Pending Rewards",
      value: `${parseFloat(stakingData.pendingRewards).toFixed(4)}`,
      subtitle: "DREAM tokens",
      icon: TrendingUp,
      color: "text-[hsl(215,82%,61%)]"
    },
    {
      title: "Current APY",
      value: `${stakingData.apy}%`,
      subtitle: "Annual yield",
      icon: Coins,
      color: "text-[hsl(43,89%,56%)]"
    },
    {
      title: "Status",
      value: contractsDeployed ? "Live" : "Offline",
      subtitle: "BSC Testnet",
      icon: Zap,
      color: contractsDeployed ? "text-green-400" : "text-red-400"
    }
  ];

  const dreamTypes = [
    {
      type: "Lucid Dreams",
      multiplier: "5x",
      baseReward: "$2.50",
      description: "Conscious control within dreams",
      rarity: "Epic",
      color: "text-[hsl(325,84%,61%)]"
    },
    {
      type: "Prophetic Dreams",
      multiplier: "10x",
      baseReward: "$5.00",
      description: "Dreams that predict future events",
      rarity: "Legendary",
      color: "text-[hsl(43,89%,56%)]"
    },
    {
      type: "Nightmares",
      multiplier: "3x",
      baseReward: "$1.50",
      description: "Dark or frightening dreams",
      rarity: "Rare",
      color: "text-[hsl(258,84%,66%)]"
    },
    {
      type: "Recurring Dreams",
      multiplier: "4x",
      baseReward: "$2.00",
      description: "Dreams that repeat patterns",
      rarity: "Rare",
      color: "text-[hsl(215,82%,61%)]"
    },
    {
      type: "Normal Dreams",
      multiplier: "1x",
      baseReward: "$0.50",
      description: "Standard dream experiences",
      rarity: "Common",
      color: "text-gray-400"
    }
  ];

  const leaderboard = [
    { rank: 1, username: "DreamWeaver_42", earnings: "$2,847.50", dreams: 127, badge: "Legendary Dreamer" },
    { rank: 2, username: "NightVisions", earnings: "$1,932.25", dreams: 89, badge: "Epic Dreamer" },
    { rank: 3, username: "SleepArtist", earnings: "$1,654.75", dreams: 156, badge: "Dream Master" },
    { rank: 4, username: "LucidExplorer", earnings: "$1,287.00", dreams: 73, badge: "Lucid Legend" },
    { rank: 5, username: "MysticSleeper", earnings: "$1,156.50", dreams: 98, badge: "Mystic Dreamer" }
  ];

  const miningRewards = [
    { activity: "Record Dream", reward: "$0.50 - $5.00", frequency: "Daily" },
    { activity: "AI Interpretation", reward: "$0.25", frequency: "Per analysis" },
    { activity: "Community Voting", reward: "$0.10", frequency: "Per vote" },
    { activity: "NFT Creation", reward: "$1.00", frequency: "Per mint" },
    { activity: "Dream Sharing", reward: "$0.15", frequency: "Per share" },
    { activity: "Pattern Discovery", reward: "$2.50", frequency: "Weekly" }
  ];

  if (!isConnected) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Dream Mining Dashboard</h1>
            <p className="text-gray-300">Connect your wallet to start earning from your dream data</p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-card border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-400">
                      {stat.subtitle}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Earning Potential */}
          <Card className="glass-card border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Dream Mining Rewards
              </CardTitle>
              <p className="text-gray-400">Earn different amounts based on your dream types and activities</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dreamTypes.map((dream, index) => (
                  <Card key={index} className="glass-card border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{dream.type}</h3>
                        <Badge className={`${dream.color} bg-black/50`}>
                          {dream.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{dream.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[hsl(43,89%,56%)]">{dream.baseReward}</span>
                        <span className="text-sm text-[hsl(258,84%,66%)]">{dream.multiplier}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mining Activities */}
          <Card className="glass-card border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Coins className="mr-2 h-5 w-5" />
                Mining Activities & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {miningRewards.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="h-5 w-5 text-[hsl(258,84%,66%)]" />
                      <div>
                        <h4 className="text-white font-medium">{activity.activity}</h4>
                        <p className="text-sm text-gray-400">{activity.frequency}</p>
                      </div>
                    </div>
                    <div className="text-[hsl(43,89%,56%)] font-semibold">
                      {activity.reward}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Staking Interface */}
          <Card className="glass-card border-white/10">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-white">Stake DREAM Tokens</h3>
                <p className="text-gray-300 mb-6">
                  Stake your DREAM tokens to earn 15% APY and boost your mining rewards
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter DREAM amount"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleStake}
                    disabled={isStaking || !stakeAmount || !contractsDeployed}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isStaking ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Staking...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Stake Tokens
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Staked Amount</span>
                      <span className="text-white">{parseFloat(stakingData.stakedAmount).toFixed(2)} DREAM</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Pending Rewards</span>
                      <span className="text-green-400">{parseFloat(stakingData.pendingRewards).toFixed(4)} DREAM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">APY</span>
                      <span className="text-yellow-400">{stakingData.apy}%</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleClaimRewards}
                    disabled={parseFloat(stakingData.pendingRewards) === 0 || !contractsDeployed}
                    variant="outline"
                    className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    Claim Rewards
                  </Button>
                </div>
              </div>
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
            <h1 className="text-4xl font-bold gradient-text mb-2">Dream Mining Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Badge className="category-tag">
                Wallet Connected
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                Mining Active
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={contractsDeployed ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
              {contractsDeployed ? "BSC Testnet Connected" : "Network Offline"}
            </Badge>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-400">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList className="glass-card border-white/10">
            <TabsTrigger value="earnings" className="data-[state=active]:bg-white/20">Earnings</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-white/20">Reward Types</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="text-3xl font-bold text-[hsl(43,89%,56%)] mb-2">$0.00</div>
                  <p className="text-gray-400">Start recording dreams to earn</p>
                  <div className="mt-4">
                    <Progress value={0} className="h-2" />
                    <p className="text-xs text-gray-500 mt-2">0% of weekly goal ($25.00)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Passive Income Potential
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Dreams (avg 3)</span>
                    <span className="text-[hsl(43,89%,56%)]">$1.50/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Weekly Goal</span>
                    <span className="text-[hsl(43,89%,56%)]">$10.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Potential</span>
                    <span className="text-[hsl(43,89%,56%)] font-bold">$45.00</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">With Premium Dreams</span>
                    <span className="text-[hsl(325,84%,61%)] font-bold">$150.00+</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Top Dream Miners
                </CardTitle>
                <p className="text-gray-400">Most valuable dreams this month</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-[hsl(43,89%,56%)] text-black' :
                          index === 1 ? 'bg-gray-300 text-black' :
                          index === 2 ? 'bg-orange-400 text-black' :
                          'bg-white/20 text-white'
                        }`}>
                          {index < 3 ? <Crown className="h-4 w-4" /> : user.rank}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{user.username}</h4>
                          <p className="text-sm text-gray-400">{user.dreams} dreams • {user.badge}</p>
                        </div>
                      </div>
                      <div className="text-[hsl(43,89%,56%)] font-bold">
                        {user.earnings}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Dream Type Multipliers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dreamTypes.map((dream, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-3">
                        <Star className={`h-4 w-4 ${dream.color}`} />
                        <div>
                          <h4 className="text-white text-sm font-medium">{dream.type}</h4>
                          <p className="text-xs text-gray-400">{dream.rarity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[hsl(43,89%,56%)] font-semibold">{dream.baseReward}</div>
                        <div className="text-xs text-[hsl(258,84%,66%)]">{dream.multiplier}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Bonus Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {miningRewards.slice(0, 6).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-3">
                        <Lightbulb className="h-4 w-4 text-[hsl(258,84%,66%)]" />
                        <div>
                          <h4 className="text-white text-sm font-medium">{activity.activity}</h4>
                          <p className="text-xs text-gray-400">{activity.frequency}</p>
                        </div>
                      </div>
                      <div className="text-[hsl(43,89%,56%)] font-semibold text-sm">
                        {activity.reward}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DreamMining;
