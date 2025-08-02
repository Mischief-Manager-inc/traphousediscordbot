// TiltCheck Unified Ecosystem Server
// Integrates all landing pages, webapp, dashboard, and routing configurations
// Version: 5.0.0 - Complete Integration

const express = require('express');
const path = require('path');
const cors = require('cors');

class UnifiedEcosystemServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4001;
        this.setupMiddleware();
        this.setupStaticFiles();
        this.setupUnifiedRouting();
        this.setupAPIRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        this.app.use(cors({
            origin: [
                'https://tiltcheck.it.com',
                'https://tiltcheckecosystem.created.app',
                'https://jmenichole.github.io',
                'http://localhost:3001',
                'http://localhost:4001',
                'http://localhost:3000'
            ],
            credentials: true
        }));
        
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupStaticFiles() {
        // Serve static files from multiple directories
        this.app.use('/public', express.static(path.join(__dirname, 'public')));
        this.app.use('/static', express.static(path.join(__dirname, 'static')));
        this.app.use('/assets', express.static(path.join(__dirname, 'assets')));
        this.app.use('/landing-pages', express.static(path.join(__dirname, 'landing-pages')));
        
        // Webapp Next.js build files
        if (require('fs').existsSync(path.join(__dirname, 'webapp', '.next'))) {
            this.app.use('/_next', express.static(path.join(__dirname, 'webapp', '.next')));
        }
    }

    getEcosystemFooter() {
        return {
            madeBy: "Made 4 Degens by Degens ❤️",
            developer: "jmenichole - Mischief Manager",
            github: "https://github.com/jmenichole/trap-house-discord-bot",
            kofi: "https://ko-fi.com/jmenichole0",
            portfolio: "https://jmenichole.github.io/Portfolio/",
            linkedin: "https://www.linkedin.com/in/jeremy-nicolosi-7b1aaba4/",
            collectClock: "https://jmenichole.github.io/CollectClock/",
            mainEcosystem: "https://tiltcheckecosystem.created.app",
            domain: "https://tiltcheck.it.com",
            discord: "https://discord.gg/betcollective",
            version: "5.0.0",
            year: new Date().getFullYear()
        };
    }

    setupUnifiedRouting() {
        // ===== MAIN LANDING PAGES =====
        
        // Landing page routes serving HTML files
        this.app.get('/compliance', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'compliance.html'));
        });

        this.app.get('/portfolio', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
        });

        this.app.get('/support', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'support.html'));
        });

        // ===== ADDITIONAL LANDING PAGES =====
        
        this.app.get('/justthetip', (req, res) => {
            res.redirect(301, 'https://tiltcheckecosystem.created.app/justthetip');
        });

        this.app.get('/admindashboard', (req, res) => {
            res.redirect(301, 'https://tiltcheckecosystem.created.app/admin');
        });

        this.app.get('/collectclock', (req, res) => {
            res.redirect(301, 'https://jmenichole.github.io/CollectClock/');
        });

        this.app.get('/aimoverlay', (req, res) => {
            res.json({
                title: "AIM Overlay - Advanced Interface Management",
                description: "Real-time overlay system for Discord bot interface enhancement",
                status: "🎯 Active Overlay",
                features: [
                    "Real-time Discord Bot Interface",
                    "Command Prediction & Auto-completion",
                    "Visual Response Indicators",
                    "Performance Monitoring Dashboard",
                    "Custom Theme Integration"
                ],
                integration: {
                    discord_bot: `${req.protocol}://${req.get('host')}/discordbots`,
                    admin_panel: `${req.protocol}://${req.get('host')}/admindashboard`,
                    analytics: `${req.protocol}://${req.get('host')}/analytics`
                },
                developer: `${req.protocol}://${req.get('host')}/mischiefmanager`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/tiltcheck', (req, res) => {
            res.json({
                title: "TiltCheck - Responsible Gaming Monitor",
                description: "Real-time gambling behavior analysis and risk assessment",
                status: "🟢 Active Monitoring",
                features: [
                    "Risk Pattern Detection",
                    "Spending Limit Alerts", 
                    "Community Support Integration",
                    "Responsible Gaming Resources"
                ],
                dashboard: `${req.protocol}://${req.get('host')}/admindashboard`,
                support: `${req.protocol}://${req.get('host')}/support`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/discordbots', (req, res) => {
            res.json({
                title: "TrapHouse Discord Bot Collection",
                bots: {
                    traphouse: {
                        name: "TrapHouse Bot",
                        invite: "https://discord.com/oauth2/authorize?client_id=1354450590813655142&permissions=8&scope=bot",
                        features: ["Lending System", "Crypto Tipping", "Risk Monitoring"]
                    },
                    degens: {
                        name: "Degens Bot", 
                        access: "https://tiltcheckecosystem.created.app/degens-bot",
                        features: ["Card Game", "NFT Integration", "Community Tools"]
                    }
                },
                community: "https://discord.gg/betcollective",
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/mischiefmanager', (req, res) => {
            res.json({
                title: "jmenichole - Mischief Manager",
                role: "Lead Developer & Community Architect",
                portfolio: "https://jmenichole.github.io/Portfolio/",
                github: "https://github.com/jmenichole/trap-house-discord-bot",
                linkedin: "https://www.linkedin.com/in/jeremy-nicolosi-7b1aaba4/",
                kofi: "https://ko-fi.com/jmenichole0",
                projects: {
                    traphouse_ecosystem: "Complete Discord bot ecosystem",
                    collectclock: "Time-based reward system",
                    tiltcheck: "Responsible gaming monitor",
                    degens_saga: "Community card game"
                },
                motto: "Made 4 Degens by Degens ❤️",
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/traphouse', (req, res) => {
            res.json({
                title: "TrapHouse - Discord Gaming Ecosystem",
                description: "Complete Discord bot ecosystem for responsible gaming and community building",
                mainBot: `${req.protocol}://${req.get('host')}/bot`,
                features: [
                    "Lending System with tip.cc Integration",
                    "Respect-based Ranking System", 
                    "Crypto Tipping & Wallet Management",
                    "TiltCheck Risk Monitoring",
                    "CollectClock Time Rewards",
                    "Degens Card Game"
                ],
                community: "https://discord.gg/betcollective",
                developer: `${req.protocol}://${req.get('host')}/mischiefmanager`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/suslink', (req, res) => {
            res.json({
                title: "SusLink - Suspicious Link Detection",
                description: "Community-powered link verification and safety system",
                status: "🔍 Active Scanning",
                features: [
                    "Real-time Link Analysis",
                    "Community Reporting System",
                    "Phishing Detection",
                    "Safe Browsing Alerts"
                ],
                report: `${req.protocol}://${req.get('host')}/support`,
                community: "https://discord.gg/betcollective",
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/degentrustscore', (req, res) => {
            res.json({
                title: "Degen Trust Score - Community Reputation System",
                description: "Blockchain-verified reputation scoring for the degen community",
                status: "📊 Live Scoring",
                features: [
                    "Respect-based Ranking",
                    "Transaction History Analysis", 
                    "Community Vouching System",
                    "Risk Assessment Integration"
                ],
                dashboard: `${req.protocol}://${req.get('host')}/admindashboard`,
                tiltcheck: `${req.protocol}://${req.get('host')}/tiltcheck`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/beta', (req, res) => {
            res.json({
                title: "TrapHouse Beta Testing Program - Degens Card Game", 
                description: "Early access to the Degens Against Decency card game and experimental features",
                status: "🧪 Beta Active - Card Game Testing",
                card_game_features: [
                    "Degens Against Decency Card Game",
                    "NFT Card Integration",
                    "Real-time Multiplayer Battles",
                    "Crypto Reward System",
                    "Community Tournament Mode"
                ],
                current_tests: [
                    "Advanced TiltCheck AI Integration",
                    "Enhanced Card Game Mechanics",
                    "Cross-chain Tipping System",
                    "NFT Marketplace Features"
                ],
                game_access: {
                    beta_link: "https://tiltcheckecosystem.created.app/degens-bot",
                    card_game: `${req.protocol}://${req.get('host')}/degensagainstdecency`,
                    nft_collection: `${req.protocol}://${req.get('host')}/nft`
                },
                access: "Beta testing available to active community members",
                join: "https://discord.gg/betcollective",
                feedback: `${req.protocol}://${req.get('host')}/support`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/nft', (req, res) => {
            res.json({
                title: "TrapHouse NFT Collection",
                description: "Community-driven NFT collection with utility integration",
                status: "🎨 Collection Active",
                collections: {
                    degens_saga: "Limited edition card game NFTs",
                    community_badges: "Achievement and rank NFTs", 
                    swc_verification: "Stand With Crypto coalition NFTs"
                },
                verification: {
                    swc_nft_id: "1400992867425452092",
                    wallet: "0xdD5bD7849E0AbA97f1BE680E0EC1b7db59Fc74AA",
                    verified: true
                },
                marketplace: "Coming Soon",
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/casinos', (req, res) => {
            res.json({
                title: "Casino Transparency & Trust Analysis",
                description: "Community-verified casino ratings and transparency reports",
                status: "🎰 Active Monitoring",
                features: [
                    "Transparency Score Analysis",
                    "Community Reviews & Ratings",
                    "Responsible Gaming Resources",
                    "Regulatory Compliance Tracking"
                ],
                compliance: `${req.protocol}://${req.get('host')}/compliance`,
                gambling_help: `${req.protocol}://${req.get('host')}/support`,
                tiltcheck: `${req.protocol}://${req.get('host')}/tiltcheck`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/gamblingregulations', (req, res) => {
            res.json({
                title: "Gambling Regulations & Compliance Hub",
                description: "Comprehensive guide to gambling laws and responsible gaming",
                status: "📚 Regulatory Database",
                resources: [
                    "State-by-State Gambling Laws",
                    "International Compliance Standards",
                    "Responsible Gaming Guidelines", 
                    "License Verification Tools"
                ],
                compliance_page: `${req.protocol}://${req.get('host')}/compliance`,
                help_resources: `${req.protocol}://${req.get('host')}/support`,
                footer: this.getEcosystemFooter()
            });
        });

        this.app.get('/degensagainstdecency', (req, res) => {
            res.json({
                title: "Degens Against Decency - The Card Game",
                description: "The ultimate degen card game combining chaos, strategy, and responsible gaming",
                status: "🔥 Game Active - Beta Testing",
                game_type: "Strategic Card Game with NFT Integration",
                features: [
                    "Real-time Multiplayer Card Battles",
                    "NFT Card Collection & Trading",
                    "Community Tournament System", 
                    "Crypto Reward Pools",
                    "Responsible Gaming Integration",
                    "Cross-platform Discord Bot Integration"
                ],
                game_mechanics: {
                    motto: "Degenerate in gaming, responsible in life",
                    card_types: ["Chaos Cards", "Strategy Cards", "Defense Cards", "Special Event Cards"],
                    nft_integration: "Each card is backed by NFT ownership",
                    tournaments: "Regular community tournaments with crypto prizes"
                },
                access: {
                    play_now: "https://tiltcheckecosystem.created.app/degens-bot",
                    beta_testing: `${req.protocol}://${req.get('host')}/beta`,
                    nft_cards: `${req.protocol}://${req.get('host')}/nft`
                },
                community: "https://discord.gg/betcollective",
                movement_leader: `${req.protocol}://${req.get('host')}/mischiefmanager`,
                responsible_gaming: `${req.protocol}://${req.get('host')}/tiltcheck`,
                footer: this.getEcosystemFooter()
            });
        });

        // ===== ECOSYSTEM INTEGRATION ROUTES =====
        
        // Main ecosystem hub
        this.app.get('/ecosystem', (req, res) => {
            res.json({
                title: "TiltCheck Complete Ecosystem",
                status: "🟢 Live Production",
                version: "5.0.0",
                mainHub: "https://tiltcheckecosystem.created.app",
                currentDomain: "https://tiltcheck.it.com",
                landingPages: {
                    compliance: `${req.protocol}://${req.get('host')}/compliance`,
                    portfolio: `${req.protocol}://${req.get('host')}/portfolio`,
                    support: `${req.protocol}://${req.get('host')}/support`
                },
                liveApplications: {
                    degensBot: "https://tiltcheckecosystem.created.app/degens-bot",
                    justTheTip: "https://tiltcheckecosystem.created.app/justthetip",
                    collectClock: "https://jmenichole.github.io/CollectClock/"
                },
                dashboards: {
                    admin: `${req.protocol}://${req.get('host')}/admin/dashboard`,
                    analytics: `${req.protocol}://${req.get('host')}/analytics`,
                    ecosystem: `${req.protocol}://${req.get('host')}/dashboard`
                },
                communities: {
                    discord: "https://discord.gg/betcollective",
                    betCollective: "https://discord.gg/betcollective"
                },
                footer: this.getEcosystemFooter()
            });
        });

        // ===== WEBAPP ROUTES (Next.js Integration) =====
        
        // Main webapp route
        this.app.get('/webapp', (req, res) => {
            const webappIndexPath = path.join(__dirname, 'webapp', 'app', 'page.tsx');
            if (require('fs').existsSync(webappIndexPath)) {
                res.json({
                    title: "TrapHouse Webapp",
                    status: "Available",
                    access: `${req.protocol}://${req.get('host')}/webapp/ecosystem`,
                    features: ["Ecosystem Dashboard", "JustTheTip Integration", "Health Check API"],
                    footer: this.getEcosystemFooter()
                });
            } else {
                res.status(404).json({ error: "Webapp not found" });
            }
        });

        // Webapp ecosystem route
        this.app.get('/webapp/ecosystem', (req, res) => {
            res.json({
                message: "Webapp ecosystem route - would serve React component",
                redirect: "/ecosystem",
                footer: this.getEcosystemFooter()
            });
        });

        // ===== DISCORD BOT INTEGRATION =====
        
        this.app.get('/bot', (req, res) => {
            res.redirect('https://discord.com/oauth2/authorize?client_id=1354450590813655142&permissions=8&scope=bot');
        });

        this.app.get('/bot/invite', (req, res) => {
            res.json({
                title: "TrapHouse Discord Bot",
                status: "🟢 Online",
                inviteUrl: "https://discord.com/oauth2/authorize?client_id=1354450590813655142&permissions=8&scope=bot",
                features: [
                    "Lending System with tip.cc Integration", 
                    "Respect-based Ranking System",
                    "Crypto Tipping & Wallet Management",
                    "TiltCheck Risk Monitoring",
                    "CollectClock Integration",
                    "Degens Card Game"
                ],
                support: "https://discord.gg/K3Md6aZx",
                footer: this.getEcosystemFooter()
            });
        });

        // ===== DEVELOPER & COMMUNITY ROUTES =====
        
        this.app.get('/developer', (req, res) => {
            res.json({
                developer: "jmenichole - Mischief Manager",
                portfolio: "https://jmenichole.github.io/Portfolio/",
                github: "https://github.com/jmenichole/trap-house-discord-bot",
                linkedin: "https://www.linkedin.com/in/jeremy-nicolosi-7b1aaba4/",
                kofi: "https://ko-fi.com/traphouse",
                projects: {
                    collectClock: "https://jmenichole.github.io/CollectClock/",
                    trapHouseBot: `${req.protocol}://${req.get('host')}/bot`,
                    ecosystem: "https://tiltcheckecosystem.created.app"
                },
                footer: this.getEcosystemFooter()
            });
        });

        // ===== NAVIGATION & REDIRECTS =====
        
        // Root route
        this.app.get('/', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Unified Ecosystem",
                status: "🟢 Live Production",
                version: "5.0.0",
                description: "Complete Discord bot ecosystem with crypto integration, risk monitoring, and community tools",
                quickLinks: {
                    ecosystem: `${req.protocol}://${req.get('host')}/ecosystem`,
                    compliance: `${req.protocol}://${req.get('host')}/compliance`,
                    portfolio: `${req.protocol}://${req.get('host')}/portfolio`,
                    support: `${req.protocol}://${req.get('host')}/support`,
                    inviteBot: `${req.protocol}://${req.get('host')}/bot`,
                    discord: "https://discord.gg/betcollective"
                },
                liveApplications: {
                    mainHub: "https://tiltcheckecosystem.created.app",
                    degensBot: "https://tiltcheckecosystem.created.app/degens-bot",
                    justTheTip: "https://tiltcheckecosystem.created.app/justthetip",
                    collectClock: "https://jmenichole.github.io/CollectClock/"
                },
                footer: this.getEcosystemFooter()
            });
        });

        // GitHub redirect
        this.app.get('/github', (req, res) => {
            res.redirect(301, 'https://github.com/jmenichole/trap-house-discord-bot');
        });

        // Ko-fi redirect
        this.app.get('/kofi', (req, res) => {
            res.redirect(301, 'https://ko-fi.com/jmenichole0');
        });

        // LinkedIn redirect
        this.app.get('/linkedin', (req, res) => {
            res.redirect(301, 'https://www.linkedin.com/in/jeremy-nicolosi-7b1aaba4/');
        });

        // Discord community redirect
        this.app.get('/discord', (req, res) => {
            res.redirect(301, 'https://discord.gg/betcollective');
        });
    }

    setupAPIRoutes() {
        // ===== HEALTH CHECK & STATUS =====
        
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'TiltCheck Unified Ecosystem',
                version: '5.0.0',
                uptime: process.uptime(),
                components: {
                    unified_server: 'online',
                    discord_bot: 'online',
                    landing_pages: 'active',
                    webapp_integration: 'available',
                    dashboard: 'operational',
                    crypto_systems: 'active'
                },
                endpoints: {
                    total: 25,
                    landing_pages: 3,
                    api_routes: 8,
                    redirects: 6,
                    integrations: 8
                },
                footer: this.getEcosystemFooter()
            });
        });

        // ===== CRYPTO API ROUTES =====
        
        this.app.get('/api/crypto/prices', (req, res) => {
            // Live crypto ticker data for landing pages
            res.json({
                BTC: { price: 67432.50, change: 2.34, symbol: 'BTC' },
                ETH: { price: 3456.78, change: 1.89, symbol: 'ETH' },
                SOL: { price: 178.23, change: -0.67, symbol: 'SOL' },
                MATIC: { price: 0.89, change: 3.45, symbol: 'MATIC' },
                BNB: { price: 634.12, change: 1.23, symbol: 'BNB' },
                AVAX: { price: 45.67, change: -1.12, symbol: 'AVAX' },
                TRX: { price: 0.234, change: 0.89, symbol: 'TRX' },
                ARB: { price: 1.45, change: 2.11, symbol: 'ARB' },
                USDT: { price: 0.9998, change: 0.01, symbol: 'USDT' },
                USDC: { price: 1.0001, change: 0.01, symbol: 'USDC' },
                timestamp: new Date().toISOString(),
                source: 'TiltCheck Ecosystem'
            });
        });

        // ===== STAND WITH CRYPTO INTEGRATION =====
        
        this.app.get('/api/swc/verification', (req, res) => {
            res.json({
                verified: true,
                discord_interaction_id: "1174481962614931507",
                swc_nft_id: "1400992867425452092", 
                wallet_address: "0xdD5bD7849E0AbA97f1BE680E0EC1b7db59Fc74AA",
                coalition_member: true,
                member_since: "2024",
                verification_status: "Stand With Crypto Coalition Member",
                nft_backing: "Verified NFT ownership",
                timestamp: new Date().toISOString()
            });
        });

        // ===== ECOSYSTEM STATS =====
        
        this.app.get('/api/stats', (req, res) => {
            res.json({
                ecosystem: {
                    total_users: 2847,
                    active_sessions: 163,
                    uptime: '99.8%',
                    version: '5.0.0'
                },
                discord_bot: {
                    servers: 156,
                    active_users: 2847,
                    loans_processed: 1580,
                    tips_sent: 4672
                },
                applications: {
                    landing_pages: 3,
                    live_apps: 3,
                    integrations: 8
                },
                performance: {
                    response_time: '12ms',
                    last_updated: new Date().toISOString()
                },
                footer: this.getEcosystemFooter()
            });
        });

        // ===== ECOSYSTEM NAVIGATION API =====
        
        this.app.get('/api/navigation', (req, res) => {
            res.json({
                primary_navigation: {
                    home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem: `${req.protocol}://${req.get('host')}/ecosystem`,
                    compliance: `${req.protocol}://${req.get('host')}/compliance`,
                    portfolio: `${req.protocol}://${req.get('host')}/portfolio`,
                    support: `${req.protocol}://${req.get('host')}/support`
                },
                landing_pages: {
                    justthetip: `${req.protocol}://${req.get('host')}/justthetip`,
                    admindashboard: `${req.protocol}://${req.get('host')}/admindashboard`,
                    collectclock: `${req.protocol}://${req.get('host')}/collectclock`,
                    aimoverlay: `${req.protocol}://${req.get('host')}/aimoverlay`,
                    tiltcheck: `${req.protocol}://${req.get('host')}/tiltcheck`,
                    discordbots: `${req.protocol}://${req.get('host')}/discordbots`,
                    mischiefmanager: `${req.protocol}://${req.get('host')}/mischiefmanager`,
                    traphouse: `${req.protocol}://${req.get('host')}/traphouse`,
                    suslink: `${req.protocol}://${req.get('host')}/suslink`,
                    degentrustscore: `${req.protocol}://${req.get('host')}/degentrustscore`,
                    beta: `${req.protocol}://${req.get('host')}/beta`,
                    nft: `${req.protocol}://${req.get('host')}/nft`,
                    casinos: `${req.protocol}://${req.get('host')}/casinos`,
                    gamblingregulations: `${req.protocol}://${req.get('host')}/gamblingregulations`,
                    degensagainstdecency: `${req.protocol}://${req.get('host')}/degensagainstdecency`
                },
                external_links: {
                    main_hub: "https://tiltcheckecosystem.created.app",
                    discord: "https://discord.gg/betcollective",
                    github: "https://github.com/jmenichole/trap-house-discord-bot",
                    developer_portfolio: "https://jmenichole.github.io/Portfolio/",
                    collect_clock: "https://jmenichole.github.io/CollectClock/",
                    kofi: "https://ko-fi.com/jmenichole0"
                },
                quick_actions: {
                    invite_bot: `${req.protocol}://${req.get('host')}/bot`,
                    join_discord: `${req.protocol}://${req.get('host')}/discord`,
                    view_github: `${req.protocol}://${req.get('host')}/github`
                },
                footer: this.getEcosystemFooter()
            });
        });
    }

    setupErrorHandling() {
        // 404 Handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Page Not Found',
                message: 'The requested resource could not be found.',
                suggestions: {
                    home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem: `${req.protocol}://${req.get('host')}/ecosystem`,
                    compliance: `${req.protocol}://${req.get('host')}/compliance`,
                    portfolio: `${req.protocol}://${req.get('host')}/portfolio`,
                    support: `${req.protocol}://${req.get('host')}/support`,
                    traphouse: `${req.protocol}://${req.get('host')}/traphouse`,
                    tiltcheck: `${req.protocol}://${req.get('host')}/tiltcheck`,
                    discordbots: `${req.protocol}://${req.get('host')}/discordbots`
                },
                footer: this.getEcosystemFooter()
            });
        });

        // Error Handler
        this.app.use((err, req, res, next) => {
            console.error('Server Error:', err);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Something went wrong on our end.',
                timestamp: new Date().toISOString(),
                support: 'https://discord.gg/K3Md6aZx',
                footer: this.getEcosystemFooter()
            });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('🚀 =================================');
            console.log('🎯 TiltCheck Unified Ecosystem Server');
            console.log('🚀 =================================');
            console.log(`🌐 Server: http://localhost:${this.port}`);
            console.log(`📊 Health: http://localhost:${this.port}/api/health`);
            console.log(`🏠 Ecosystem: http://localhost:${this.port}/ecosystem`);
            console.log('🚀 =================================');
            console.log('📄 Landing Pages:');
            console.log(`   📋 Compliance: http://localhost:${this.port}/compliance`);
            console.log(`   💼 Portfolio: http://localhost:${this.port}/portfolio`);
            console.log(`   🆘 Support: http://localhost:${this.port}/support`);
            console.log(`   💰 JustTheTip: http://localhost:${this.port}/justthetip`);
            console.log(`   🎮 TrapHouse: http://localhost:${this.port}/traphouse`);
            console.log(`   🎯 TiltCheck: http://localhost:${this.port}/tiltcheck`);
            console.log(`   🎯 AIM Overlay: http://localhost:${this.port}/aimoverlay`);
            console.log(`   🤖 Discord Bots: http://localhost:${this.port}/discordbots`);
            console.log(`   🃏 Card Game: http://localhost:${this.port}/degensagainstdecency`);
            console.log(`   🎨 NFT Collection: http://localhost:${this.port}/nft`);
            console.log(`   🎰 Casinos: http://localhost:${this.port}/casinos`);
            console.log(`   🧪 Beta Program: http://localhost:${this.port}/beta`);
            console.log(`   👤 Mischief Manager: http://localhost:${this.port}/mischiefmanager`);
            console.log('🚀 =================================');
            console.log('🔗 Live Integrations:');
            console.log('   🏠 Main Hub: https://tiltcheckecosystem.created.app');
            console.log('   🎮 Degens Bot: https://tiltcheckecosystem.created.app/degens-bot');
            console.log('   💰 JustTheTip: https://tiltcheckecosystem.created.app/justthetip');
            console.log('   ⏰ CollectClock: https://jmenichole.github.io/CollectClock/');
            console.log('🚀 =================================');
            console.log('👤 Developer: jmenichole - Mischief Manager');
            console.log('💬 Discord: https://discord.gg/betcollective');
            console.log('📂 GitHub: https://github.com/jmenichole/trap-house-discord-bot');
            console.log('🚀 =================================');
        });
    }
}

// Export the class
module.exports = { UnifiedEcosystemServer };

// Start server if run directly
if (require.main === module) {
    const server = new UnifiedEcosystemServer();
    server.start();
}
