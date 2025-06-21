import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SimpleWalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!(window as any).ethereum) return;

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainId, 16));
      }
    } catch (error) {
      console.log('Connection check failed:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress("");
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(parseInt(chainId, 16));
  };

  const connectWallet = async () => {
    // Check for multiple wallet providers
    const ethereum = (window as any).ethereum;
    const trustWallet = (window as any).trustwallet;
    
    if (!ethereum && !trustWallet) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or Trust Wallet browser extension",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    try {
      let provider = ethereum;
      
      // If Trust Wallet is available and user prefers it, use it directly
      if (trustWallet && trustWallet.ethereum) {
        provider = trustWallet.ethereum;
      }
      // Handle multiple injected wallets
      else if (ethereum?.providers?.length > 0) {
        // Find Trust Wallet provider
        const trustProvider = ethereum.providers.find((p: any) => p.isTrustWallet || p.isTrust);
        if (trustProvider) {
          provider = trustProvider;
        }
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const chainId = await provider.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainId, 16));

        // Switch to BSC Testnet if not already connected
        if (parseInt(chainId, 16) !== 97) {
          await switchToBSCTestnet(provider);
        }

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('Connection failed:', error);
      
      // Handle specific Trust Wallet errors
      if (error.message?.includes('dapp.frames-disallowed') || error.message?.includes('frames-disallowed')) {
        toast({
          title: "Trust Wallet Blocked",
          description: "Trust Wallet blocks iframe connections. Use MetaMask or open in Trust Wallet browser directly",
          variant: "destructive"
        });
      } else if (error.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "You declined the wallet connection. Click Connect again and approve the request",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect wallet",
          variant: "destructive"
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToBSCTestnet = async (provider: any = (window as any).ethereum) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }], // BSC Testnet
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x61',
              chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'tBNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add BSC Testnet:', addError);
        }
      }
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress("");
    setChainId(0);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 97: return "BSC Testnet";
      case 56: return "BSC Mainnet";
      case 1: return "Ethereum";
      case 137: return "Polygon";
      default: return `Chain ${chainId}`;
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Badge className={chainId === 97 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
            {getNetworkName(chainId)}
          </Badge>
          <div className="text-sm text-gray-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
        <a
          href={`https://testnet.bscscan.com/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="text-white border-white/20 hover:bg-white/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] hover:from-[hsl(215,82%,61%)] hover:to-[hsl(325,84%,61%)]"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}