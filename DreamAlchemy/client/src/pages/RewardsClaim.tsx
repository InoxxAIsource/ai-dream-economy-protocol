import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { contractService } from "@/lib/contractService";

export default function RewardsClaim() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [claimingRewardId, setClaimingRewardId] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Check wallet connection status
  useEffect(() => {
    const checkConnection = async () => {
      if ((window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.log('Connection check failed:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if ((window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAddress("");
        } else {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Fetch real mining rewards from API
  const { data: miningRewards = [], isLoading } = useQuery({
    queryKey: ['/api/mining-rewards'],
    queryFn: () => fetch('/api/mining-rewards').then(res => res.json())
  });

  const pendingRewards = miningRewards.map((reward: any) => ({
    id: reward.id,
    dreamTitle: reward.dreamTitle,
    category: reward.category,
    rarityScore: reward.rarityScore,
    tokensEarned: reward.tokensEarned,
    submittedAt: reward.submittedAt,
    status: "pending"
  }));

  const handleClaimReward = async (rewardId: number, amount: number) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to claim DREAM tokens",
        variant: "destructive"
      });
      return;
    }

    setClaimingRewardId(rewardId);
    setIsProcessing(true);

    try {
      // Check if window.ethereum exists
      if (!(window as any).ethereum) {
        throw new Error("MetaMask or Web3 wallet not detected");
      }

      // Initialize contract service with proper provider
      const { BrowserProvider } = await import('ethers');
      const provider = new BrowserProvider((window as any).ethereum);
      await contractService.initialize(provider);

      // Check if we're on the right network
      const networkInfo = await contractService.getNetworkInfo();
      if (networkInfo && Number(networkInfo.chainId) !== 97) {
        await contractService.switchToBSCTestnet();
      }

      toast({
        title: "Processing Reward",
        description: `Claiming ${amount} DREAM tokens to your wallet...`,
      });
      
      // Call backend API to handle token minting (server controls the contract)
      const response = await fetch(`/api/dreams/${rewardId}/claim-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          amount: amount
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result && result.success) {
        toast({
          title: "Reward Claimed Successfully!",
          description: `${amount} DREAM tokens minted to your wallet. TX: ${result.transactionHash.slice(0, 10)}...`,
        });

        // Mark as claimed locally only after successful transaction
        setClaimedRewards(prev => [...prev, rewardId.toString()]);
      } else {
        throw new Error(result.error || "Transaction failed");
      }

    } catch (error: any) {
      console.error('Reward claim failed:', error);
      
      if (error.code === 4001) {
        toast({
          title: "Transaction Rejected",
          description: "You cancelled the transaction in your wallet",
          variant: "destructive"
        });
      } else if (error.message?.includes('insufficient funds')) {
        toast({
          title: "Insufficient BNB",
          description: "You need BNB to pay for gas fees on BSC Testnet",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Claim Failed",
          description: error.message || "Failed to claim reward",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
      setClaimingRewardId(null);
    }
  };

  const totalPendingTokens = pendingRewards
    .filter(reward => !claimedRewards.includes(reward.id.toString()))
    .reduce((sum, reward) => sum + reward.tokensEarned, 0);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-300">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Reward Claims</h1>
          <p className="text-gray-300">
            Claim your earned DREAM tokens from dream submissions
          </p>
        </div>

        {/* Summary Card */}
        <Card className="glass-card border-white/10 mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[hsl(43,89%,56%)] mb-2">
                  {totalPendingTokens} DREAM
                </div>
                <p className="text-gray-400">Total Pending Rewards</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {pendingRewards.length}
                </div>
                <p className="text-gray-400">Dreams Submitted</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {claimedRewards.length}
                </div>
                <p className="text-gray-400">Rewards Claimed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Rewards */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Coins className="mr-2 h-5 w-5" />
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRewards.map((reward) => {
              // Only show as claimed if we have blockchain confirmation - for now reset all to unclaimed
              const isClaimed = false; // Reset claiming status since we're fixing the system
              
              return (
                <div key={reward.id} className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {reward.dreamTitle}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Submitted on {new Date(reward.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[hsl(43,89%,56%)]">
                        {reward.tokensEarned} DREAM
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300">
                        {reward.category} Dream
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-300">
                        Rarity Score: <span className="text-white font-medium">{reward.rarityScore}/100</span>
                      </div>
                      <a 
                        href={`https://testnet.bscscan.com/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                      >
                        View on BSCScan <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>

                    {isClaimed ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Claimed
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleClaimReward(reward.id, reward.tokensEarned)}
                        disabled={isProcessing || !isConnected}
                        className="bg-gradient-to-r from-[hsl(43,89%,56%)] to-[hsl(258,84%,66%)] hover:scale-105 transition-transform duration-200"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Coins className="mr-2 h-4 w-4" />
                            Claim Reward
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {pendingRewards.length === 0 && (
              <div className="text-center py-12">
                <Coins className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Pending Rewards</h3>
                <p className="text-gray-500">Submit dreams to start earning DREAM tokens</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="glass-card border-white/10 mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How to Claim Rewards</h3>
            <div className="space-y-2 text-gray-300">
              <p>1. Connect your wallet to BSC Testnet</p>
              <p>2. Click "Claim Reward" for any pending dream submission</p>
              <p>3. Confirm the transaction in your wallet</p>
              <p>4. DREAM tokens will be added to your wallet balance</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}