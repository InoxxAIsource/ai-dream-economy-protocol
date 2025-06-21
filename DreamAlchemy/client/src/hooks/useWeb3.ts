import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { parseEther, formatEther, type Address } from 'viem'
import { useState, useEffect } from 'react'
import { useToast } from './use-toast'
import { BrowserProvider } from 'ethers'
import { 
  CONTRACTS, 
  DREAM_TOKEN_ABI, 
  DREAM_NFT_ABI, 
  MARKETPLACE_ABI, 
  STAKING_ABI, 
  MINING_ABI,
  TOKEN_DECIMALS,
  INITIAL_MINING_RATE,
  RARITY_MULTIPLIERS,
  STAKING_REWARDS
} from '@/lib/web3'

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const publicClient = usePublicClient()
  const [provider, setProvider] = useState<BrowserProvider | null>(null)

  useEffect(() => {
    if (isConnected && typeof window !== 'undefined' && (window as any).ethereum) {
      const ethersProvider = new BrowserProvider((window as any).ethereum)
      setProvider(ethersProvider)
    } else {
      setProvider(null)
    }
  }, [isConnected])

  return {
    address,
    isConnected,
    provider,
    publicClient,
    toast
  }
}

export function useDreamToken() {
  const { address, isConnected, toast } = useWeb3()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get DREAM token balance
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.DREAM_TOKEN as Address,
    abi: DREAM_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.DREAM_TOKEN as Address,
    abi: DREAM_TOKEN_ABI,
    functionName: 'totalSupply'
  })

  const transfer = async (to: Address, amount: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to transfer DREAM tokens",
        variant: "destructive"
      })
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.DREAM_TOKEN as Address,
        abi: DREAM_TOKEN_ABI,
        functionName: 'transfer',
        args: [to, parseEther(amount)]
      })
      
      toast({
        title: "Transfer Initiated",
        description: "Your DREAM token transfer is being processed"
      })
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Unable to transfer DREAM tokens",
        variant: "destructive"
      })
    }
  }

  const approve = async (spender: Address, amount: string) => {
    if (!isConnected) return

    try {
      await writeContract({
        address: CONTRACTS.DREAM_TOKEN as Address,
        abi: DREAM_TOKEN_ABI,
        functionName: 'approve',
        args: [spender, parseEther(amount)]
      })
    } catch (error) {
      console.error('Approval failed:', error)
    }
  }

  return {
    balance: balance ? formatEther(balance as bigint) : '0',
    totalSupply: totalSupply ? formatEther(totalSupply as bigint) : '0',
    balanceLoading,
    isConfirming,
    isConfirmed,
    transfer,
    approve,
    refetchBalance
  }
}

export function useDreamNFT() {
  const { address, isConnected, toast } = useWeb3()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get NFT balance
  const { data: nftBalance, refetch: refetchNFTBalance } = useReadContract({
    address: CONTRACTS.DREAM_NFT as Address,
    abi: DREAM_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const mint = async (tokenURI: string) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint NFT",
        variant: "destructive"
      })
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.DREAM_NFT as Address,
        abi: DREAM_NFT_ABI,
        functionName: 'mint',
        args: [address, tokenURI]
      })
      
      toast({
        title: "NFT Minting",
        description: "Your dream NFT is being minted"
      })
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Unable to mint dream NFT",
        variant: "destructive"
      })
    }
  }

  const transfer = async (to: Address, tokenId: bigint) => {
    if (!isConnected || !address) return

    try {
      await writeContract({
        address: CONTRACTS.DREAM_NFT as Address,
        abi: DREAM_NFT_ABI,
        functionName: 'transferFrom',
        args: [address, to, tokenId]
      })
    } catch (error) {
      console.error('NFT transfer failed:', error)
    }
  }

  return {
    nftBalance: nftBalance ? Number(nftBalance) : 0,
    isConfirming,
    isConfirmed,
    mint,
    transfer,
    refetchNFTBalance
  }
}

export function useStaking() {
  const { address, isConnected, toast } = useWeb3()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get staked amount
  const { data: stakedAmount, refetch: refetchStaked } = useReadContract({
    address: CONTRACTS.STAKING as Address,
    abi: STAKING_ABI,
    functionName: 'getStakedAmount',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: CONTRACTS.STAKING as Address,
    abi: STAKING_ABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const stake = async (amount: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to stake DREAM tokens",
        variant: "destructive"
      })
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.STAKING as Address,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [parseEther(amount)]
      })
      
      toast({
        title: "Staking Initiated",
        description: "Your DREAM tokens are being staked"
      })
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Unable to stake DREAM tokens",
        variant: "destructive"
      })
    }
  }

  const unstake = async (amount: string) => {
    if (!isConnected) return

    try {
      await writeContract({
        address: CONTRACTS.STAKING as Address,
        abi: STAKING_ABI,
        functionName: 'unstake',
        args: [parseEther(amount)]
      })
      
      toast({
        title: "Unstaking Initiated",
        description: "Your DREAM tokens are being unstaked"
      })
    } catch (error) {
      toast({
        title: "Unstaking Failed",
        description: "Unable to unstake DREAM tokens",
        variant: "destructive"
      })
    }
  }

  const claimRewards = async () => {
    if (!isConnected) return

    try {
      await writeContract({
        address: CONTRACTS.STAKING as Address,
        abi: STAKING_ABI,
        functionName: 'claimRewards'
      })
      
      toast({
        title: "Claiming Rewards",
        description: "Your staking rewards are being claimed"
      })
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Unable to claim rewards",
        variant: "destructive"
      })
    }
  }

  return {
    stakedAmount: stakedAmount ? formatEther(stakedAmount as bigint) : '0',
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0',
    isConfirming,
    isConfirmed,
    stake,
    unstake,
    claimRewards,
    refetchStaked,
    refetchRewards
  }
}

export function useDreamMining() {
  const { address, isConnected, toast } = useWeb3()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get mining rate
  const { data: miningRate } = useReadContract({
    address: CONTRACTS.MINING as Address,
    abi: MINING_ABI,
    functionName: 'getMiningRate',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  // Get total mined
  const { data: totalMined } = useReadContract({
    address: CONTRACTS.MINING as Address,
    abi: MINING_ABI,
    functionName: 'getTotalMined',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  })

  const submitDream = async (dreamId: number, rarityScore: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mine DREAM tokens",
        variant: "destructive"
      })
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.MINING as Address,
        abi: MINING_ABI,
        functionName: 'submitDream',
        args: [BigInt(dreamId), BigInt(rarityScore)]
      })
      
      toast({
        title: "Dream Submitted",
        description: "Your dream is being processed for DREAM token rewards"
      })
    } catch (error) {
      toast({
        title: "Mining Failed",
        description: "Unable to submit dream for mining",
        variant: "destructive"
      })
    }
  }

  const calculateReward = (rarityScore: number): number => {
    let multiplier: number = 1.0
    
    if (rarityScore >= 90) multiplier = 7.5  // LEGENDARY
    else if (rarityScore >= 80) multiplier = 4.0  // EPIC
    else if (rarityScore >= 70) multiplier = 2.5  // RARE
    else if (rarityScore >= 50) multiplier = 1.5  // UNCOMMON
    else multiplier = 1.0  // COMMON

    return INITIAL_MINING_RATE * multiplier
  }

  return {
    miningRate: miningRate ? Number(formatEther(miningRate as bigint)) : INITIAL_MINING_RATE,
    totalMined: totalMined ? formatEther(totalMined as bigint) : '0',
    isConfirming,
    isConfirmed,
    submitDream,
    calculateReward
  }
}

export function useMarketplace() {
  const { address, isConnected, toast } = useWeb3()
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const listNFT = async (tokenId: number, price: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to list NFT",
        variant: "destructive"
      })
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.MARKETPLACE as Address,
        abi: MARKETPLACE_ABI,
        functionName: 'listNFT',
        args: [BigInt(tokenId), parseEther(price)]
      })
      
      toast({
        title: "NFT Listed",
        description: "Your dream NFT is now available for sale"
      })
    } catch (error) {
      toast({
        title: "Listing Failed",
        description: "Unable to list NFT for sale",
        variant: "destructive"
      })
    }
  }

  const buyNFT = async (tokenId: number, price: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFT",
        variant: "destructive"
      })
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.MARKETPLACE as Address,
        abi: MARKETPLACE_ABI,
        functionName: 'buyNFT',
        args: [BigInt(tokenId)],
        value: parseEther(price)
      })
      
      toast({
        title: "Purchase Initiated",
        description: "Your NFT purchase is being processed"
      })
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to purchase NFT",
        variant: "destructive"
      })
    }
  }

  const getListingPrice = async (tokenId: number) => {
    // This would typically be implemented with useReadContract
    // For now, return a placeholder
    return '0'
  }

  return {
    isConfirming,
    isConfirmed,
    listNFT,
    buyNFT,
    getListingPrice
  }
}