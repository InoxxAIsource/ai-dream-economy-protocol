import { Contract, BrowserProvider, formatEther, parseEther } from 'ethers';

// Contract addresses - BNB Smart Chain deployment
const CONTRACT_ADDRESSES = {
  DREAM_TOKEN: import.meta.env.VITE_DREAM_TOKEN_ADDRESS || '0xe04879E0Dbf549567F535c7EB9d997A2769119cF',
  DREAM_NFT: import.meta.env.VITE_DREAM_NFT_ADDRESS || '0x6FB8bb0df6C0e39b4fd972608f3ec5cE03683e45',
  STAKING: import.meta.env.VITE_STAKING_ADDRESS || '0xabae58bc76983b578c9195321fa1d86d0e9ebcad',
  MARKETPLACE: import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x7abc94c4fe5a63f326aa4be87dac4954e94f8b67',
  GOVERNANCE: import.meta.env.VITE_GOVERNANCE_ADDRESS || '0x727A9b23B380c25f2547aFe8c8a28A6431BE0E62',
};

// Simplified ABIs for the deployed contracts
const DREAM_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function addMinter(address minter)"
];

const DREAM_NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mint(address to, string uri) returns (uint256)",
  "function approve(address to, uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)"
];

const STAKING_ABI = [
  "function stakes(address user) view returns (uint256 amount, uint256 timestamp, uint256 rewards)",
  "function stake(uint256 amount)",
  "function unstake(uint256 amount)",
  "function claimRewards()",
  "function getRewards(address user) view returns (uint256)",
  "function APY() view returns (uint256)"
];

export class ContractService {
  private provider: BrowserProvider | null = null;
  private signer: any = null;
  
  async initialize(provider: BrowserProvider) {
    this.provider = provider;
    this.signer = await provider.getSigner();
    
    // Force network refresh to ensure we get the correct network
    try {
      await this.provider.send("eth_requestAccounts", []);
    } catch (error) {
      console.log('Account request failed, continuing...');
    }
  }

  async switchToBSCTestnet() {
    if (!this.provider) return false;
    
    try {
      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: "0x61" } // BSC Testnet chain ID in hex
      ]);
      return true;
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await this.provider.send("wallet_addEthereumChain", [
            {
              chainId: "0x61",
              chainName: "BSC Testnet",
              nativeCurrency: {
                name: "tBNB",
                symbol: "tBNB",
                decimals: 18,
              },
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
              blockExplorerUrls: ["https://testnet.bscscan.com/"],
            },
          ]);
          return true;
        } catch (addError) {
          console.error('Failed to add BSC Testnet:', addError);
          return false;
        }
      }
      console.error('Failed to switch to BSC Testnet:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }

  // DREAM Token methods
  async getDreamTokenContract() {
    if (!this.signer || !CONTRACT_ADDRESSES.DREAM_TOKEN) {
      throw new Error('Contract not initialized or address not set');
    }
    return new Contract(CONTRACT_ADDRESSES.DREAM_TOKEN, DREAM_TOKEN_ABI, this.signer);
  }

  async getDreamTokenBalance(address: string): Promise<string> {
    const contract = await this.getDreamTokenContract();
    const balance = await contract.balanceOf(address);
    return formatEther(balance);
  }

  async transferDreamTokens(to: string, amount: string): Promise<any> {
    const contract = await this.getDreamTokenContract();
    const tx = await contract.transfer(to, parseEther(amount));
    return tx.wait();
  }

  async mintDreamTokens(to: string, amount: string): Promise<any> {
    const contract = await this.getDreamTokenContract();
    const tx = await contract.mint(to, parseEther(amount));
    return tx.wait();
  }

  async approveDreamTokens(spender: string, amount: string): Promise<any> {
    const contract = await this.getDreamTokenContract();
    const tx = await contract.approve(spender, parseEther(amount));
    return tx.wait();
  }

  // Dream NFT methods
  async getDreamNFTContract() {
    if (!this.signer || !CONTRACT_ADDRESSES.DREAM_NFT) {
      throw new Error('Contract not initialized or address not set');
    }
    return new Contract(CONTRACT_ADDRESSES.DREAM_NFT, DREAM_NFT_ABI, this.signer);
  }

  async mintDreamNFT(to: string, tokenURI: string): Promise<any> {
    const contract = await this.getDreamNFTContract();
    const tx = await contract.mint(to, tokenURI);
    return tx.wait();
  }

  async getNFTBalance(address: string): Promise<number> {
    try {
      const contract = await this.getDreamNFTContract();
      const balance = await contract.balanceOf(address);
      return balance.toNumber();
    } catch (error) {
      console.log('Error fetching NFT balance:', error);
      return 0;
    }
  }

  async getNFTOwner(tokenId: number): Promise<string> {
    const contract = await this.getDreamNFTContract();
    return await contract.ownerOf(tokenId);
  }

  async getNFTTokenURI(tokenId: number): Promise<string> {
    const contract = await this.getDreamNFTContract();
    return await contract.tokenURI(tokenId);
  }

  // Staking methods
  async getStakingContract() {
    if (!this.signer || !CONTRACT_ADDRESSES.STAKING) {
      throw new Error('Contract not initialized or address not set');
    }
    return new Contract(CONTRACT_ADDRESSES.STAKING, STAKING_ABI, this.signer);
  }

  async getStakeInfo(address: string): Promise<{
    amount: string,
    timestamp: number,
    rewards: string
  }> {
    try {
      const contract = await this.getStakingContract();
      const stake = await contract.stakes(address);
      return {
        amount: formatEther(stake.amount || 0),
        timestamp: stake.timestamp ? stake.timestamp.toNumber() : 0,
        rewards: formatEther(stake.rewards || 0)
      };
    } catch (error) {
      console.log('No staking data found for address:', address);
      return {
        amount: "0",
        timestamp: 0,
        rewards: "0"
      };
    }
  }

  async stakeDreamTokens(amount: string): Promise<any> {
    // First approve the staking contract to spend tokens
    await this.approveDreamTokens(CONTRACT_ADDRESSES.STAKING, amount);
    
    const contract = await this.getStakingContract();
    const tx = await contract.stake(parseEther(amount));
    return tx.wait();
  }

  async unstakeDreamTokens(amount: string): Promise<any> {
    const contract = await this.getStakingContract();
    const tx = await contract.unstake(parseEther(amount));
    return tx.wait();
  }

  async claimStakingRewards(): Promise<any> {
    const contract = await this.getStakingContract();
    const tx = await contract.claimRewards();
    return tx.wait();
  }

  async getPendingRewards(address: string): Promise<string> {
    const contract = await this.getStakingContract();
    const rewards = await contract.getRewards(address);
    return formatEther(rewards);
  }

  async getAPY(): Promise<number> {
    const contract = await this.getStakingContract();
    const apy = await contract.APY();
    return apy.toNumber();
  }

  // Utility methods
  async getNetworkInfo() {
    if (!this.provider) return null;
    return await this.provider.getNetwork();
  }

  async getGasPrice() {
    if (!this.provider) return null;
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice;
  }

  // Check if contracts are deployed
  async verifyContracts(): Promise<{
    dreamToken: boolean,
    dreamNFT: boolean,
    staking: boolean,
    marketplace: boolean,
    governance: boolean
  }> {
    if (!this.provider) {
      return {
        dreamToken: false,
        dreamNFT: false,
        staking: false,
        marketplace: false,
        governance: false
      };
    }

    const results = {
      dreamToken: false,
      dreamNFT: false,
      staking: false,
      marketplace: false,
      governance: false
    };

    try {
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);
      console.log('Current network:', {
        chainId: chainId,
        name: network.name,
        isEthereum: chainId === 1,
        isBSCMainnet: chainId === 56,
        isBSCTestnet: chainId === 97
      });
      
      // Check if we're on BSC mainnet (56) or testnet (97)
      const isBSC = chainId === 56 || chainId === 97;
      
      if (!isBSC) {
        console.log(`Network ${chainId} is not BSC. Please switch to BSC Mainnet (56) or BSC Testnet (97)`);
        return results;
      }
      
      console.log('BSC network detected, checking contracts...');
      console.log('Contract addresses:', CONTRACT_ADDRESSES);
      
      // For BSC testnet/mainnet, the contracts should be deployed at the same addresses
      if (CONTRACT_ADDRESSES.DREAM_TOKEN) {
        const code = await this.provider.getCode(CONTRACT_ADDRESSES.DREAM_TOKEN);
        results.dreamToken = code !== '0x' && code.length > 2;
        console.log('DREAM_TOKEN deployed:', results.dreamToken);
      }
      
      if (CONTRACT_ADDRESSES.DREAM_NFT) {
        const code = await this.provider.getCode(CONTRACT_ADDRESSES.DREAM_NFT);
        results.dreamNFT = code !== '0x' && code.length > 2;
        console.log('DREAM_NFT deployed:', results.dreamNFT);
      }
      
      if (CONTRACT_ADDRESSES.STAKING) {
        const code = await this.provider.getCode(CONTRACT_ADDRESSES.STAKING);
        results.staking = code !== '0x' && code.length > 2;
        console.log('STAKING deployed:', results.staking);
      }
      
      if (CONTRACT_ADDRESSES.MARKETPLACE) {
        const code = await this.provider.getCode(CONTRACT_ADDRESSES.MARKETPLACE);
        results.marketplace = code !== '0x' && code.length > 2;
        console.log('MARKETPLACE deployed:', results.marketplace);
      }
      
      if (CONTRACT_ADDRESSES.GOVERNANCE) {
        const code = await this.provider.getCode(CONTRACT_ADDRESSES.GOVERNANCE);
        results.governance = code !== '0x' && code.length > 2;
        console.log('GOVERNANCE deployed:', results.governance);
      }
      
      console.log('Final contract verification results:', results);
    } catch (error) {
      console.error('Error verifying contracts:', error);
    }

    return results;
  }
}

export const contractService = new ContractService();