import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, bsc, optimism } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '4f7ba3e8f8c94c4b8b7e5d3f2a1b9c0d'

// 2. Create wagmiConfig
const metadata = {
  name: 'AI Dream Economy Protocol',
  description: 'Turn your dreams into digital gold through AI-powered interpretation and NFT creation',
  url: window.location.origin, // Use actual domain to avoid Trust Wallet issues
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, polygon, bsc, optimism] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: false, // Disable WalletConnect to avoid key errors
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
  ssr: false
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(258, 84%, 66%)',
    '--w3m-border-radius-master': '12px',
  }
})

export const queryClient = new QueryClient()

// Smart Contract Addresses (These would be deployed contracts)
export const CONTRACTS = {
  DREAM_TOKEN: '0x0000000000000000000000000000000000000000', // DREAM ERC-20 token
  DREAM_NFT: '0x0000000000000000000000000000000000000000',   // Dream NFT collection
  MARKETPLACE: '0x0000000000000000000000000000000000000000', // NFT marketplace
  STAKING: '0x0000000000000000000000000000000000000000',     // Staking contract
  GOVERNANCE: '0x0000000000000000000000000000000000000000',  // Governance contract
  MINING: '0x0000000000000000000000000000000000000000',      // Dream mining rewards
} as const

// Smart Contract ABIs
export const DREAM_TOKEN_ABI = [
  {
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const DREAM_NFT_ABI = [
  {
    "inputs": [{"name": "to", "type": "address"}, {"name": "tokenURI", "type": "string"}],
    "name": "mint",
    "outputs": [{"name": "tokenId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "from", "type": "address"}, {"name": "to", "type": "address"}, {"name": "tokenId", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const MARKETPLACE_ABI = [
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}, {"name": "price", "type": "uint256"}],
    "name": "listNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "buyNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getListingPrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const STAKING_ABI = [
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getStakedAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getPendingRewards",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const MINING_ABI = [
  {
    "inputs": [{"name": "dreamId", "type": "uint256"}, {"name": "rarityScore", "type": "uint256"}],
    "name": "submitDream",
    "outputs": [{"name": "reward", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getMiningRate",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getTotalMined",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Token Economics Constants
export const TOKEN_DECIMALS = 18
export const INITIAL_MINING_RATE = 10 // Base DREAM tokens per dream
export const RARITY_MULTIPLIERS = {
  COMMON: 1.0,
  UNCOMMON: 1.5,
  RARE: 2.5,
  EPIC: 4.0,
  LEGENDARY: 7.5
} as const

export const STAKING_REWARDS = {
  DAILY_APR: 0.15, // 15% daily APR for staking
  MINING_BOOST: 2.0 // 2x mining rate for stakers
} as const

export const MARKETPLACE_FEES = {
  PLATFORM_FEE: 0.075, // 7.5% platform fee
  ROYALTY_FEE: 0.025   // 2.5% royalty to original dreamer
} as const