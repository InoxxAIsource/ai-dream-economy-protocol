import { useAccount, useDisconnect } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useDreamToken, useStaking, useDreamMining } from '@/hooks/useWeb3'
import { useToast } from '@/hooks/use-toast'

interface WalletConnectProps {
  realContractData?: {
    dreamBalance: string;
    stakedAmount: string;
    pendingRewards: string;
    nftCount: number;
  };
  contractsDeployed?: boolean;
}

export function WalletConnect({ realContractData, contractsDeployed = false }: WalletConnectProps) {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { balance, balanceLoading } = useDreamToken()
  const { stakedAmount, pendingRewards } = useStaking()
  const { totalMined } = useDreamMining()
  const { toast } = useToast()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const openExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, '_blank')
      }
    }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <w3m-button />
      </div>
    )
  }

  return (
    <Card className="glass-card border-white/10 w-80">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Wallet Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[hsl(258,84%,66%)]" />
              <span className="text-sm font-medium text-white">Connected</span>
              {chain && (
                <Badge variant="outline" className="text-xs">
                  {chain.name}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Address */}
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
            <span className="text-sm text-gray-300 font-mono">
              {formatAddress(address || '')}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openExplorer}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Token Balances */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">DREAM Balance</span>
              <span className="text-sm font-medium text-white">
                {balanceLoading ? '...' : 
                 contractsDeployed && realContractData ? 
                   `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(parseFloat(realContractData.dreamBalance))} DREAM` :
                   `${parseFloat(balance).toFixed(2)} DREAM`
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Staked</span>
              <span className="text-sm font-medium text-[hsl(258,84%,66%)]">
                {contractsDeployed && realContractData ? 
                  `${parseFloat(realContractData.stakedAmount).toFixed(2)} DREAM` :
                  `${parseFloat(stakedAmount).toFixed(2)} DREAM`
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Pending Rewards</span>
              <span className="text-sm font-medium text-[hsl(43,89%,56%)]">
                {contractsDeployed && realContractData ? 
                  `${parseFloat(realContractData.pendingRewards).toFixed(4)} DREAM` :
                  `${parseFloat(pendingRewards).toFixed(4)} DREAM`
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Mined</span>
              <span className="text-sm font-medium text-green-400">
                {parseFloat(totalMined).toFixed(2)} DREAM
              </span>
            </div>
          </div>

          {/* Network Status */}
          <div className="border-t border-white/10 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">{formatAddress(address || '')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}