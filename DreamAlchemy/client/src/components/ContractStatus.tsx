import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contractService } from "@/lib/contractService";
import { CheckCircle, AlertTriangle, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContractStatusProps {
  provider?: any;
}

export function ContractStatus({ provider }: ContractStatusProps) {
  const [contractStatus, setContractStatus] = useState({
    dreamToken: false,
    dreamNFT: false,
    staking: false,
    marketplace: false,
    governance: false
  });
  const [loading, setLoading] = useState(true);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (provider) {
      // Add a small delay to ensure wallet connection is fully established
      const timer = setTimeout(() => {
        checkContractStatus();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [provider]);

  const checkContractStatus = async () => {
    if (!provider) return;
    
    setLoading(true);
    try {
      console.log('Initializing contract service...');
      await contractService.initialize(provider);
      console.log('Verifying contracts...');
      const status = await contractService.verifyContracts();
      console.log('Getting network info...');
      const network = await contractService.getNetworkInfo();
      
      console.log('Setting contract status:', status);
      console.log('Setting network info:', network);
      
      setContractStatus(status);
      setNetworkInfo(network);
    } catch (error) {
      console.error('Error checking contract status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToBSC = async () => {
    try {
      const success = await contractService.switchToBSCTestnet();
      if (success) {
        toast({
          title: "Network Switched",
          description: "Successfully switched to BSC Testnet",
        });
        // Wait a moment for the network switch to complete
        setTimeout(() => {
          checkContractStatus();
        }, 2000);
      } else {
        toast({
          title: "Switch Failed",
          description: "Failed to switch to BSC Testnet. Please switch manually in MetaMask.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: "Error",
        description: "Error switching networks. Please switch manually in MetaMask.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusBadge = (deployed: boolean) => {
    return deployed ? (
      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        Deployed
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Not Deployed
      </Badge>
    );
  };

  const addresses = contractService.getContractAddresses();
  const anyDeployed = Object.values(contractStatus).some(status => status);
  const allDeployed = Object.values(contractStatus).every(status => status);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Checking Smart Contracts...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-purple-500/30 rounded w-3/4"></div>
            <div className="h-4 bg-purple-500/30 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Network Info */}
      {networkInfo && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Connected Network</p>
                <p className="text-white font-semibold">
                  {networkInfo.name} (Chain ID: {networkInfo.chainId})
                </p>
              </div>
              <div className="flex gap-2">
                {Number(networkInfo.chainId) !== 97 && (
                  <Button
                    onClick={handleSwitchToBSC}
                    size="sm"
                    className="bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30"
                  >
                    Switch to BSC Testnet
                  </Button>
                )}
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  {networkInfo.chainId === 97 ? "BSC Testnet" : networkInfo.chainId === 56 ? "BSC Mainnet" : "Other Network"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contract Status Overview */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Smart Contract Status
            {allDeployed && <CheckCircle className="w-5 h-5 text-green-400" />}
            {!anyDeployed && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {allDeployed 
              ? "All contracts are deployed and ready for use"
              : anyDeployed 
                ? "Some contracts are deployed, complete deployment for full functionality"
                : "No contracts deployed yet - deploy contracts to enable blockchain features"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-purple-500/20">
                <div>
                  <p className="text-white font-medium">DREAM Token</p>
                  <p className="text-gray-400 text-sm">ERC-20 utility token</p>
                </div>
                {getStatusBadge(contractStatus.dreamToken)}
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-purple-500/20">
                <div>
                  <p className="text-white font-medium">Dream NFT</p>
                  <p className="text-gray-400 text-sm">Dream artwork NFTs</p>
                </div>
                {getStatusBadge(contractStatus.dreamNFT)}
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-purple-500/20">
                <div>
                  <p className="text-white font-medium">Staking</p>
                  <p className="text-gray-400 text-sm">15% APY staking rewards</p>
                </div>
                {getStatusBadge(contractStatus.staking)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-purple-500/20">
                <div>
                  <p className="text-white font-medium">Marketplace</p>
                  <p className="text-gray-400 text-sm">NFT trading platform</p>
                </div>
                {getStatusBadge(contractStatus.marketplace)}
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-purple-500/20">
                <div>
                  <p className="text-white font-medium">Governance</p>
                  <p className="text-gray-400 text-sm">Community voting</p>
                </div>
                {getStatusBadge(contractStatus.governance)}
              </div>
            </div>
          </div>

          {/* Contract Addresses */}
          {anyDeployed && (
            <div className="mt-6 space-y-2">
              <h4 className="text-white font-medium">Contract Addresses</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {addresses.DREAM_TOKEN && (
                  <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-purple-500/10">
                    <span className="text-gray-300 text-sm">DREAM Token:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{addresses.DREAM_TOKEN.slice(0, 6)}...{addresses.DREAM_TOKEN.slice(-4)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(addresses.DREAM_TOKEN, "DREAM Token address")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {addresses.DREAM_NFT && (
                  <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-purple-500/10">
                    <span className="text-gray-300 text-sm">Dream NFT:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{addresses.DREAM_NFT.slice(0, 6)}...{addresses.DREAM_NFT.slice(-4)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(addresses.DREAM_NFT, "Dream NFT address")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {addresses.STAKING && (
                  <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-purple-500/10">
                    <span className="text-gray-300 text-sm">Staking:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{addresses.STAKING.slice(0, 6)}...{addresses.STAKING.slice(-4)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(addresses.STAKING, "Staking address")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {addresses.MARKETPLACE && (
                  <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-purple-500/10">
                    <span className="text-gray-300 text-sm">Marketplace:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{addresses.MARKETPLACE.slice(0, 6)}...{addresses.MARKETPLACE.slice(-4)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(addresses.MARKETPLACE, "Marketplace address")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {addresses.GOVERNANCE && (
                  <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-purple-500/10">
                    <span className="text-gray-300 text-sm">Governance:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">{addresses.GOVERNANCE.slice(0, 6)}...{addresses.GOVERNANCE.slice(-4)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(addresses.GOVERNANCE, "Governance address")}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deployment Instructions */}
          {!allDeployed && (
            <Alert className="bg-yellow-500/10 border-yellow-500/30">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <p>To enable full blockchain functionality, deploy the smart contracts first.</p>
                <Button
                  variant="link" 
                  className="p-0 h-auto text-yellow-400 hover:text-yellow-300"
                  onClick={() => window.open('/smart-contracts-deployment.md', '_blank')}
                >
                  View deployment guide <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={checkContractStatus}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              Refresh Status
            </Button>
            
            <Button
              variant="outline"
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
              onClick={() => window.open('https://remix.ethereum.org/', '_blank')}
            >
              Deploy on Remix <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}