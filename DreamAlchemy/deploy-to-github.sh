#!/bin/bash

# AI Dream Economy Protocol - GitHub Deployment Script
echo "🚀 Deploying AI Dream Economy Protocol to GitHub..."

# Remove existing remote if it exists
git remote remove origin 2>/dev/null || true

# Add GitHub repository
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/InoxxAIsource/ai-dream-economy-protocol.git

# Stage all files
echo "📦 Staging files..."
git add .

# Commit with comprehensive message
echo "💾 Committing changes..."
git commit -m "Initial release: AI Dream Economy Protocol

Features:
- Complete Web3 integration with BSC testnet smart contracts
- 5 specialized AI agents for dream analysis and interpretation
- Mining rewards system with real token economics (104 DREAM earned)
- NFT marketplace with DALL-E artwork generation
- Full-stack React/Node.js architecture with PostgreSQL
- Production-ready smart contracts on BSC testnet
- Professional documentation and deployment guides

Smart Contracts (BSC Testnet):
- DREAM Token: 0xe04879E0Dbf549567F535c7EB9d997A2769119cF
- Dream NFT: 0x6FB8bb0df6C0e39b4fd972608f3ec5cE03683e45
- Staking: 0xabae58bc76983b578c9195321fa1d86d0e9ebcad
- Governance: 0x727A9b23B380c25f2547aFe8c8a28A6431BE0E62
- Marketplace: 0x7abc94c4fe5a63f326aa4be87dac4954e94f8b67"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push -u origin main

echo "✅ Deployment complete!"
echo "🔗 Your repository: https://github.com/InoxxAIsource/ai-dream-economy-protocol"