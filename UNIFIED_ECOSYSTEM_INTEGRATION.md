# TiltCheck Unified Ecosystem Integration

## 🎯 Complete Ecosystem Integration Overview

This integration unifies all TiltCheck ecosystem components into a cohesive, production-ready system with consistent navigation, domain linking, and footer structures across all pages.

## 🚀 Unified Server Architecture

### Primary Server: `unified-ecosystem-server.js`
- **Port**: 4001 (configurable via `PORT` environment variable)
- **Purpose**: Central routing hub for all landing pages, API endpoints, and ecosystem navigation
- **Features**: 
  - Unified routing for compliance, portfolio, and support pages
  - Live crypto ticker API integration
  - Stand With Crypto verification endpoint
  - Comprehensive ecosystem navigation
  - Consistent footer structure across all pages

## 📄 Landing Pages Integration

### ✅ Completed Landing Pages
1. **Compliance Page** (`/compliance`)
   - File: `public/compliance.html`
   - Features: Full SWC integration, crypto live ticker, state compliance analysis
   - Status: ✅ Complete (1156 lines)

2. **Portfolio Page** (`/portfolio`) 
   - File: `public/portfolio.html`
   - Features: Developer portfolio, project showcase, crypto tickers
   - Status: ✅ Complete

3. **Support Page** (`/support`)
   - File: `public/support.html` (to be created)
   - Features: Discord support, documentation, FAQ
   - Status: 🟡 Pending

## 🔗 Ecosystem Links & Navigation

### Domain Structure
- **Primary Domain**: `tiltcheck.it.com`
- **Main Ecosystem Hub**: `tiltcheckecosystem.created.app`
- **Developer Portfolio**: `jmenichole.github.io/Portfolio/`
- **CollectClock**: `jmenichole.github.io/CollectClock/`

### Unified Footer Structure
All pages include consistent footer with:
- Developer attribution: "jmenichole - Mischief Manager"
- GitHub: `https://github.com/jmenichole/trap-house-discord-bot`
- Ko-fi: `https://ko-fi.com/traphouse`
- LinkedIn: Professional networking link
- Discord: `https://discord.gg/K3Md6aZx`
- Portfolio: Developer showcase
- CollectClock: Project integration

## 🛠️ Server Configuration Consolidation

### Multiple Server Files Identified
1. `complete-ecosystem-server.js` - Port 3000 (comprehensive routes)
2. `tiltcheck_ecosystem_complete.js` - Port 4001 (live production)
3. `main.js` - Port 3002 (Discord bot + webhooks)
4. `dashboard/ecosystemDashboard.js` - Port 3001 (admin dashboard)
5. `unified-ecosystem-server.js` - Port 4001 (NEW - unified integration)

### Integration Strategy
- **Primary**: Use `unified-ecosystem-server.js` as main routing server
- **Dashboard**: Keep `ecosystemDashboard.js` running on port 3001 for admin functions
- **Bot**: Keep `main.js` running on port 3002 for Discord bot operations
- **Webapp**: Next.js webapp components integrated into unified server

## 📊 API Endpoints

### Core API Routes
- `/api/health` - System health and component status
- `/api/crypto/prices` - Live crypto ticker data
- `/api/swc/verification` - Stand With Crypto verification
- `/api/stats` - Ecosystem statistics
- `/api/navigation` - Complete navigation structure

### Landing Page Routes
- `/compliance` - Serves compliance.html
- `/portfolio` - Serves portfolio.html  
- `/support` - Serves support.html (to be created)

### Ecosystem Routes
- `/ecosystem` - Complete ecosystem overview
- `/bot` - Discord bot invitation redirect
- `/developer` - Developer information and links

### Quick Redirects
- `/github` → GitHub repository
- `/discord` → Discord community
- `/kofi` → Ko-fi support page
- `/linkedin` → Developer LinkedIn

## 🔧 Integration Components

### Stand With Crypto Integration
- **Discord ID**: `1174481962614931507`
- **SWC NFT ID**: `1400992867425452092`
- **Wallet**: `0xdD5bD7849E0AbA97f1BE680E0EC1b7db59Fc74AA`
- **Status**: Verified Coalition Member

### Crypto Live Tickers
Real-time price data for:
- BTC, ETH, SOL, MATIC, BNB, AVAX, TRX, ARB, USDT, USDC
- Scrolling ticker implementation on all landing pages
- API endpoint: `/api/crypto/prices`

### Webapp Integration
- Next.js components in `webapp/` directory
- React-based ecosystem dashboard
- API routes for health checks
- Integrated routing through unified server

## 🚦 Deployment Instructions

### 1. Start Unified Ecosystem Server
```bash
node unified-ecosystem-server.js
```
**Port**: 4001
**Purpose**: Main routing and landing pages

### 2. Start Admin Dashboard (Optional)
```bash
cd dashboard && node ecosystemDashboard.js
```
**Port**: 3001
**Purpose**: NFT-protected admin controls

### 3. Start Discord Bot (Optional)
```bash
node main.js
```
**Port**: 3002
**Purpose**: Discord bot operations and webhooks

### 4. Verify Integration
- Main site: `http://localhost:4001`
- Health check: `http://localhost:4001/api/health`
- Compliance: `http://localhost:4001/compliance`
- Portfolio: `http://localhost:4001/portfolio`
- Ecosystem: `http://localhost:4001/ecosystem`

## 📝 Configuration Files

### Environment Variables
```env
PORT=4001
NODE_ENV=production
CRYPTO_WALLET_SYSTEM_ENABLED=true
COMPLIANCE_REPORTING_ENABLED=true
```

### Package Dependencies
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `path` - File path utilities
- `fs` - File system operations

## 🔄 Continuous Integration

### PM2 Configuration
For production deployment with PM2:
```json
{
  "name": "tiltcheck-ecosystem",
  "script": "unified-ecosystem-server.js",
  "instances": 1,
  "autorestart": true,
  "watch": false,
  "max_memory_restart": "1G",
  "env": {
    "PORT": 4001,
    "NODE_ENV": "production"
  }
}
```

## 🆘 Support & Community

### Primary Support Channels
- **Discord**: https://discord.gg/K3Md6aZx
- **GitHub Issues**: Repository issue tracker
- **Developer Contact**: jmenichole - Mischief Manager

### Documentation
- Complete ecosystem documentation in landing pages
- API documentation via `/api/health` endpoint
- Real-time status monitoring

## 🎮 Live Applications

### External Integrations
1. **Main Ecosystem**: `tiltcheckecosystem.created.app`
2. **Degens Bot**: `tiltcheckecosystem.created.app/degens-bot`
3. **JustTheTip**: `tiltcheckecosystem.created.app/justthetip`
4. **CollectClock**: `jmenichole.github.io/CollectClock/`

### Community Servers
- **Primary Discord**: https://discord.gg/K3Md6aZx
- **Bet Collective**: https://discord.gg/betcollective

---

## 🏆 Integration Complete

**Status**: ✅ Unified ecosystem server ready for deployment
**Version**: 5.0.0
**Developer**: jmenichole - Mischief Manager
**Last Updated**: January 2025

This integration provides a complete, cohesive ecosystem with unified navigation, consistent branding, and seamless integration between all TiltCheck components.
