# Deployment Guide

## GitHub Repository Setup

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: AI Dream Economy Protocol"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create new repository: `ai-dream-economy-protocol`
3. Don't initialize with README (we already have one)
4. Copy the remote URL

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-dream-economy-protocol.git
git branch -M main
git push -u origin main
```

## Environment Setup

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Session (auto-generated)
PGDATABASE=database_name
PGHOST=database_host
PGPASSWORD=database_password
PGPORT=5432
PGUSER=username
```

## Deployment Options

### Option 1: Replit Deployment (Recommended)
1. Import GitHub repository to Replit
2. Add environment variables in Secrets tab
3. Run `npm install && npm run db:push`
4. Deploy using Replit's built-in deployment

### Option 2: Vercel Deployment
```bash
npm install -g vercel
vercel
```
- Connect GitHub repository
- Add environment variables
- Deploy automatically on push

### Option 3: Netlify Deployment
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### Option 4: Railway Deployment
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Database Setup

### Neon (Recommended)
1. Create account at [Neon](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npm run db:push`

### Supabase Alternative
1. Create project at [Supabase](https://supabase.com)
2. Get PostgreSQL connection string
3. Update environment variables

## Smart Contract Deployment

### BSC Testnet (Current)
- Already deployed and verified
- Contracts available at documented addresses

### Mainnet Deployment
```bash
# Install Hardhat dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Deploy to mainnet
npx hardhat run deploy-mainnet.js --network bsc
```

## API Keys Setup

### Anthropic API
1. Visit [Anthropic Console](https://console.anthropic.com)
2. Create API key
3. Add to environment variables

### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create API key
3. Add to environment variables

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] API keys validated
- [ ] Smart contracts deployed
- [ ] Domain configured (if custom)
- [ ] SSL certificates enabled
- [ ] Error monitoring setup
- [ ] Analytics integrated
- [ ] Backup strategy implemented

## Monitoring & Maintenance

### Error Tracking
- Implement Sentry for error monitoring
- Set up alerts for critical failures
- Monitor API usage and rate limits

### Performance
- Database query optimization
- CDN setup for static assets
- Caching strategy for API responses

### Security
- Regular dependency updates
- API rate limiting
- Input validation and sanitization
- Secure environment variable handling