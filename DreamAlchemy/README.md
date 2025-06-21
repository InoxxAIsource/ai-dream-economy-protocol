# AI Dream Economy Protocol

A revolutionary blockchain-powered platform that transforms dream experiences into digital assets through innovative Web3 technologies, AI interpretation, and NFT creation.

## 🌟 Features

### Dream Management
- **AI-Powered Dream Analysis**: Advanced interpretation using specialized AI agents
- **Dream Journal**: Rich categorization with mood tracking and privacy controls
- **Sleep Dashboard**: Integration with health trackers and sleep analytics

### Blockchain Integration
- **DREAM Token Economics**: ERC-20 utility token with staking and mining rewards
- **NFT Marketplace**: Dream-inspired artwork generation and trading
- **Multi-Chain Support**: BSC, Ethereum, Polygon, Arbitrum, and Optimism
- **Smart Contract Suite**: Complete DeFi ecosystem for dream monetization

### AI Services
- **5 Specialized Agents**: Dream Symbolist, Pattern Analyst, Trend Predictor, Mood Analyzer, Lucidity Coach
- **Dream-to-NFT Generation**: DALL-E powered artwork creation
- **Collective Insights**: Community dream trend analysis

## 🚀 Live Deployment

**Smart Contracts (BSC Testnet):**
- DREAM Token: `0xe04879E0Dbf549567F535c7EB9d997A2769119cF`
- Dream NFT: `0x6FB8bb0df6C0e39b4fd972608f3ec5cE03683e45`
- Staking: `0xabae58bc76983b578c9195321fa1d86d0e9ebcad`
- Governance: `0x727A9b23B380c25f2547aFe8c8a28A6431BE0E62`
- Marketplace: `0x7abc94c4fe5a63f326aa4be87dac4954e94f8b67`

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development builds
- **Tailwind CSS** with glass morphism design
- **Radix UI** + shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for lightweight routing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM
- **Neon** serverless database
- **Session management** with connect-pg-simple

### Blockchain
- **Ethers.js** for Web3 integration
- **WalletConnect** and Web3Modal
- **Multi-chain architecture**
- **Smart contract verification**

### AI Services
- **Anthropic Claude** for dream analysis
- **OpenAI DALL-E** for NFT artwork generation
- **Specialized agent system**

## 📦 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL database
- API keys for Anthropic and OpenAI

### Environment Setup
Create a `.env` file with:
```env
DATABASE_URL=your_postgresql_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Installation Steps
```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## 🏗 Architecture

### Database Schema
- **Users**: Authentication and profile management
- **Dreams**: Dream entries with categorization
- **Dream Analyses**: AI-generated interpretations
- **Dream NFTs**: Generated artwork metadata
- **Mining Rewards**: Token earnings tracking
- **Sleep Data**: Health integration data

### Token Economics
- **Base Reward**: 10 DREAM tokens per dream
- **Category Multipliers**: Lucid (2.5x), Prophetic (7.5x), Recurring (2.0x)
- **Staking Benefits**: 15% APY + 2x mining boost
- **Marketplace Fees**: 7.5% platform + 2.5% creator royalties

### Smart Contract System
- **DREAM Token**: Primary utility token with minting controls
- **Dream NFT**: Unique artwork NFTs with rarity scoring
- **Staking Contract**: Token locking with reward distribution
- **Marketplace**: Automated trading with royalty splits
- **Governance**: Community voting on platform decisions

## 🎮 Usage

### Dream Submission
1. Connect your Web3 wallet
2. Navigate to Dream Journal
3. Submit dream with category and ratings
4. Receive AI analysis and token rewards
5. Generate NFT artwork (optional)

### Reward Claiming
1. View pending rewards in Rewards page
2. Connect wallet to BSC Testnet
3. Click "Claim Reward" for token minting
4. Confirm transaction in wallet

### NFT Creation
1. Analyze dream for rarity scoring
2. Choose art style for generation
3. Mint NFT with metadata
4. List on marketplace (optional)

## 🔧 Development

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/          # Route components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utilities and services
├── server/             # Express backend
│   ├── routes.ts       # API endpoints
│   ├── storage.ts      # Database operations
│   └── ai-services.ts  # AI integration
├── shared/             # Shared types and schemas
└── smart-contracts/    # Blockchain deployment
```

### Key Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run db:push` - Update database schema
- `npm run deploy` - Deploy smart contracts

## 🌐 Deployment

### Frontend Deployment
The application is configured for deployment on Replit with automatic builds and port management.

### Smart Contract Deployment
Contracts are deployed using Hardhat with verification on block explorers:
```bash
node deploy-testnet.js
```

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection
- `ANTHROPIC_API_KEY` - AI analysis service
- `OPENAI_API_KEY` - NFT generation service

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Tailwind for styling
- Implement proper error handling
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://your-replit-deployment-url.replit.app)
- [Smart Contracts](https://testnet.bscscan.com/address/0xe04879E0Dbf549567F535c7EB9d997A2769119cF)
- [Documentation](./docs/)
- [API Reference](./docs/api.md)

## 💫 Acknowledgments

- Anthropic for Claude AI integration
- OpenAI for DALL-E artwork generation
- Replit for hosting and deployment
- BSC ecosystem for blockchain infrastructure

---

*Transform your dreams into digital assets with AI-powered interpretation and blockchain technology.*