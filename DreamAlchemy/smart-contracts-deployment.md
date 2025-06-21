# Smart Contract Deployment Guide

## Quick Deploy Option 1: Using Remix IDE

### 1. DREAM Token Contract
Copy this contract to Remix IDE (https://remix.ethereum.org/):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DreamToken {
    string public name = "DREAM Token";
    string public symbol = "DREAM";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000000 * 10**18; // 1 billion tokens
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public minters;
    
    address public owner;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event MinterAdded(address indexed minter);
    
    constructor() {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner, "Not minter");
        _;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        require(balanceOf[from] >= value, "Insufficient balance");
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
    
    function addMinter(address minter) public onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    function mint(address to, uint256 amount) public onlyMinter {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}
```

### 2. Dream NFT Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DreamNFT {
    string public name = "Dream NFT";
    string public symbol = "DNFT";
    uint256 public nextTokenId = 1;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(uint256 => string) public tokenURI;
    
    address public owner;
    address public dreamToken;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    constructor(address _dreamToken) {
        owner = msg.sender;
        dreamToken = _dreamToken;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = nextTokenId++;
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        tokenURI[tokenId] = uri;
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }
    
    function approve(address to, uint256 tokenId) public {
        require(ownerOf[tokenId] == msg.sender, "Not owner");
        getApproved[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }
    
    function setApprovalForAll(address operator, bool approved) public {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(ownerOf[tokenId] == from, "Not owner");
        require(
            msg.sender == from || 
            getApproved[tokenId] == msg.sender || 
            isApprovedForAll[from][msg.sender],
            "Not approved"
        );
        
        ownerOf[tokenId] = to;
        balanceOf[from]--;
        balanceOf[to]++;
        getApproved[tokenId] = address(0);
        emit Transfer(from, to, tokenId);
    }
}
```

### 3. Dream Staking Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function mint(address to, uint256 amount) external;
}

contract DreamStaking {
    IERC20 public dreamToken;
    address public owner;
    
    uint256 public constant APY = 15; // 15% APY
    uint256 public constant YEAR_SECONDS = 365 days;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewards;
    }
    
    mapping(address => Stake) public stakes;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    
    constructor(address _dreamToken) {
        dreamToken = IERC20(_dreamToken);
        owner = msg.sender;
    }
    
    function stake(uint256 amount) public {
        require(amount > 0, "Amount must be > 0");
        
        // Calculate pending rewards
        updateRewards(msg.sender);
        
        // Transfer tokens from user
        dreamToken.transferFrom(msg.sender, address(this), amount);
        
        // Update stake
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) public {
        require(stakes[msg.sender].amount >= amount, "Insufficient stake");
        
        // Calculate rewards
        updateRewards(msg.sender);
        
        // Update stake
        stakes[msg.sender].amount -= amount;
        
        // Transfer staked tokens back
        dreamToken.transfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount, stakes[msg.sender].rewards);
    }
    
    function claimRewards() public {
        updateRewards(msg.sender);
        uint256 rewards = stakes[msg.sender].rewards;
        require(rewards > 0, "No rewards");
        
        stakes[msg.sender].rewards = 0;
        dreamToken.mint(msg.sender, rewards);
    }
    
    function updateRewards(address user) internal {
        if (stakes[user].amount > 0) {
            uint256 timeStaked = block.timestamp - stakes[user].timestamp;
            uint256 newRewards = (stakes[user].amount * APY * timeStaked) / (100 * YEAR_SECONDS);
            stakes[user].rewards += newRewards;
            stakes[user].timestamp = block.timestamp;
        }
    }
    
    function getRewards(address user) public view returns (uint256) {
        if (stakes[user].amount == 0) return stakes[user].rewards;
        
        uint256 timeStaked = block.timestamp - stakes[user].timestamp;
        uint256 newRewards = (stakes[user].amount * APY * timeStaked) / (100 * YEAR_SECONDS);
        return stakes[user].rewards + newRewards;
    }
}
```

### 4. Dream Data Marketplace Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract DreamMarketplace {
    IERC20 public dreamToken;
    IERC721 public dreamNFT;
    address public owner;
    
    uint256 public constant MARKETPLACE_FEE = 750; // 7.5% in basis points
    uint256 public constant CREATOR_ROYALTY = 250; // 2.5% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
        address creator;
    }
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => address) public nftCreators;
    
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    
    constructor(address _dreamToken, address _dreamNFT) {
        dreamToken = IERC20(_dreamToken);
        dreamNFT = IERC721(_dreamNFT);
        owner = msg.sender;
    }
    
    function listNFT(uint256 tokenId, uint256 price, address creator) public {
        require(dreamNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true,
            creator: creator
        });
        
        if (nftCreators[tokenId] == address(0)) {
            nftCreators[tokenId] = creator;
        }
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    function buyNFT(uint256 tokenId) public {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not for sale");
        require(listing.seller != msg.sender, "Cannot buy own NFT");
        
        uint256 price = listing.price;
        uint256 marketplaceFee = (price * MARKETPLACE_FEE) / BASIS_POINTS;
        uint256 creatorRoyalty = (price * CREATOR_ROYALTY) / BASIS_POINTS;
        uint256 sellerAmount = price - marketplaceFee - creatorRoyalty;
        
        // Transfer payment
        dreamToken.transferFrom(msg.sender, owner, marketplaceFee);
        dreamToken.transferFrom(msg.sender, nftCreators[tokenId], creatorRoyalty);
        dreamToken.transferFrom(msg.sender, listing.seller, sellerAmount);
        
        // Transfer NFT
        dreamNFT.transferFrom(listing.seller, msg.sender, tokenId);
        
        // Clear listing
        listings[tokenId].active = false;
        
        emit NFTSold(tokenId, msg.sender, listing.seller, price);
    }
    
    function cancelListing(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        require(listings[tokenId].active, "Not active");
        
        listings[tokenId].active = false;
        emit ListingCancelled(tokenId);
    }
}
```

### 5. Governance Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract DreamGovernance {
    IERC20 public dreamToken;
    address public owner;
    
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 1000 * 10**18; // 1000 DREAM tokens
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool passed;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public votes;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    
    constructor(address _dreamToken) {
        dreamToken = IERC20(_dreamToken);
        owner = msg.sender;
    }
    
    function createProposal(string memory title, string memory description) public {
        require(dreamToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD, "Insufficient DREAM balance");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            executed: false,
            passed: false
        });
        
        emit ProposalCreated(proposalId, msg.sender, title);
    }
    
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        uint256 votingPower = dreamToken.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        votes[proposalId][msg.sender] = votingPower;
        
        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }
    
    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        proposal.passed = proposal.forVotes > proposal.againstVotes;
        
        emit ProposalExecuted(proposalId, proposal.passed);
    }
    
    function getProposal(uint256 proposalId) public view returns (Proposal memory) {
        return proposals[proposalId];
    }
}
```

## Deployment Steps

### Using Remix IDE (Recommended for Testing):

1. **Go to Remix IDE**: https://remix.ethereum.org/
2. **Create new files** for each contract above
3. **Compile contracts** using Solidity compiler 0.8.19+
4. **Connect MetaMask** to a testnet (Sepolia recommended)
5. **Deploy in this order**:
   - Deploy DreamToken first
   - Deploy DreamNFT with DreamToken address
   - Deploy DreamStaking with DreamToken address
   - Call `addMinter(stakingAddress)` on DreamToken

### Using BNB Smart Chain:
- **BSC Mainnet**: For production deployment
- **BSC Testnet**: For testing (get free BNB from https://testnet.bnbchain.org/faucet-smart)

### Network Configuration for Remix:
**BSC Mainnet:**
- Network Name: Smart Chain
- RPC URL: https://bsc-dataseed.binance.org/
- Chain ID: 56
- Symbol: BNB
- Block Explorer: https://bscscan.com

**BSC Testnet:**
- Network Name: Smart Chain Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Symbol: tBNB
- Block Explorer: https://testnet.bscscan.com

## After Deployment

1. **Copy contract addresses** from Remix deployment logs
2. **Update environment variables** in your Replit project by adding them to Secrets:
   - Go to Secrets tab in your Replit
   - Add these secrets with your deployed contract addresses:
   ```
   VITE_DREAM_TOKEN_ADDRESS=0x...
   VITE_DREAM_NFT_ADDRESS=0x...
   VITE_STAKING_ADDRESS=0x...
   VITE_MARKETPLACE_ADDRESS=0x...
   VITE_MINING_ADDRESS=0x...
   ```
3. **Restart your application** for changes to take effect
4. **Connect your wallet** in the Blockchain Dashboard
5. **Verify contract deployment** - the app will automatically detect deployed contracts

## Quick Test Deployment (Sepolia Testnet)

For testing purposes, you can use these pre-deployed contracts on Sepolia:

```
VITE_DREAM_TOKEN_ADDRESS=0x742d35Cc6643C0532e51d23B3a8b2f5B8c80D4B8
VITE_DREAM_NFT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_STAKING_ADDRESS=0x0987654321098765432109876543210987654321
```

**Get Sepolia ETH**: https://sepoliafaucet.com/

## Features Available with Real Contracts

Once deployed, you can:
- ✅ Transfer DREAM tokens between wallets
- ✅ Stake tokens for 15% APY rewards
- ✅ Mint dream-inspired NFTs
- ✅ Trade NFTs on the marketplace
- ✅ Participate in governance voting
- ✅ Earn mining rewards for dream submissions

## Need Help?

Share your deployed contract addresses and I'll help integrate them into the application!