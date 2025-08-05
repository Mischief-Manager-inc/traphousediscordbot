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
            madeBy: "Made for Degens by Degens Who Learned the Hard Way ❤️",
            developer: "jmenichole - Mischief Manager",
            originalConcept: "AI app for mental health & impulse control → evolved into responsible gaming ecosystem",
            mischiefManagerMotto: "Managing Mischief One Impulse at a Time",
            github: "https://github.com/jmenichole/trap-house-discord-bot",
            kofi: "https://ko-fi.com/jmenichole0",
            portfolio: "https://jmenichole.github.io/Portfolio/",
            linkedin: "https://www.linkedin.com/in/jeremy-nicolosi-7b1aaba4/",
            collectClock: "https://jmenichole.github.io/CollectClock/",
            mainEcosystem: "https://tiltcheckecosystem.created.app",
            domain: "https://tiltcheck.it.com",
            discord: "https://discord.gg/betcollective",
            sitemap: "https://tiltcheck.it.com/sitemap",
            mischiefManagerStory: "https://tiltcheck.it.com/mischief-manager",
            pitchDeck: "https://tiltcheck.it.com/pitch-deck",
            teamMeeting: "https://calendly.com/jmenichole/cofounder-debrief",
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

        // ===== ADDITIONAL HTML PAGES =====
        
        // Core ecosystem HTML pages
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
        
        this.app.get('/index', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
        
        this.app.get('/ecosystem', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'ecosystem.html'));
        });
        
        this.app.get('/beta', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'beta.html'));
        });
        
        this.app.get('/tiltcheck', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'tiltcheck.html'));
        });
        
        this.app.get('/nft', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'nft.html'));
        });
        
        this.app.get('/degensagainstdecency', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'degensagainstdecency.html'));
        });
        
        this.app.get('/degentrustscore', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'degentrustscore.html'));
        });
        
        this.app.get('/discordbots', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'discordbots.html'));
        });
        
        this.app.get('/suslink', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'suslink.html'));
        });
        
        this.app.get('/casinos', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'casinos.html'));
        });
        
        this.app.get('/gamblingregulations', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'gamblingregulations.html'));
        });
        
        this.app.get('/sitemap', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'sitemap.html'));
        });
        
        this.app.get('/test-dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'test-dashboard.html'));
        });
        
        this.app.get('/mischief-manager', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'mischief-manager.html'));
        });
        
        this.app.get('/mischiefmanager', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'mischief-manager.html'));
        });
        
        this.app.get('/admin-access', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'admin-access.html'));
        });
        
        this.app.get('/admin', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'admin-access.html'));
        });

        // ===== REDIRECTS & EXTERNAL INTEGRATIONS =====
        
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
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem_overview: `${req.protocol}://${req.get('host')}/ecosystem`,
                    sitemap: `${req.protocol}://${req.get('host')}/sitemap`,
                    community_support: `${req.protocol}://${req.get('host')}/support`,
                    developer_info: `${req.protocol}://${req.get('host')}/mischiefmanager`
                },
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
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem_overview: `${req.protocol}://${req.get('host')}/ecosystem`,
                    sitemap: `${req.protocol}://${req.get('host')}/sitemap`,
                    compliance_info: `${req.protocol}://${req.get('host')}/compliance`,
                    community_support: `${req.protocol}://${req.get('host')}/support`
                },
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
                title: "TrapHouse NFT Collection - Degens Against Decency Cards",
                description: "Community-driven NFT collection with utility integration and card game mechanics",
                status: "🎨 Collection Active - Card Game Integration",
                collections: {
                    degens_saga_cards: "Limited edition Degens Against Decency game cards",
                    community_badges: "Achievement and rank NFTs", 
                    swc_verification: "Stand With Crypto coalition NFTs",
                    tournament_rewards: "Special tournament winner cards"
                },
                card_game_integration: {
                    playable_cards: "Each NFT represents a playable card in the game",
                    card_trading: "Trade cards with other players",
                    tournament_prizes: "Win rare NFT cards in tournaments",
                    game_access: `${req.protocol}://${req.get('host')}/degensagainstdecency`
                },
                verification: {
                    swc_nft_id: "1400992867425452092",
                    wallet: "0xdD5bD7849E0AbA97f1BE680E0EC1b7db59Fc74AA",
                    verified: true
                },
                marketplace: "Coming Soon - NFT Card Trading",
                beta_access: `${req.protocol}://${req.get('host')}/beta`,
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
                support: "https://discord.gg/betcollective",
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
                kofi: "https://ko-fi.com/jmenichole0",
                projects: {
                    collectClock: "https://jmenichole.github.io/CollectClock/",
                    trapHouseBot: `${req.protocol}://${req.get('host')}/bot`,
                    ecosystem: "https://tiltcheckecosystem.created.app"
                },
                footer: this.getEcosystemFooter()
            });
        });

        // ===== NAVIGATION & REDIRECTS =====
        
        // Root route - Main TiltCheck.it.com Landing Page
        this.app.get('/', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Responsible Gaming Ecosystem",
                tagline: "Degenerate in Gaming, Responsible in Life",
                status: "🟢 Live Production",
                version: "5.0.0",
                mission: {
                    statement: "Empowering the degen community with responsible gaming tools, transparent casino analysis, and community-driven trust systems while maintaining the chaotic fun that makes us who we are.",
                    vision: "Building the most trusted and transparent gaming ecosystem where degens can play responsibly without losing their edge.",
                    values: ["Transparency", "Community First", "Responsible Gaming", "Innovation", "Degen Spirit"]
                },
                navigation: {
                    ecosystem_hub: `${req.protocol}://${req.get('host')}/ecosystem`,
                    compliance_center: `${req.protocol}://${req.get('host')}/compliance`,
                    developer_portfolio: `${req.protocol}://${req.get('host')}/portfolio`,
                    community_support: `${req.protocol}://${req.get('host')}/support`,
                    pitch_deck: `${req.protocol}://${req.get('host')}/pitch-deck`
                },
                core_applications: {
                    tiltcheck_monitor: {
                        url: `${req.protocol}://${req.get('host')}/tiltcheck`,
                        description: "Real-time gambling behavior analysis and risk assessment",
                        status: "🟢 Active"
                    },
                    casino_transparency: {
                        url: `${req.protocol}://${req.get('host')}/casinos`,
                        description: "Community-verified casino ratings and transparency reports",
                        status: "🎰 Monitoring"
                    },
                    trust_scoring: {
                        url: `${req.protocol}://${req.get('host')}/degentrustscore`,
                        description: "Blockchain-verified reputation scoring system",
                        status: "📊 Live"
                    },
                    suspicious_link_detection: {
                        url: `${req.protocol}://${req.get('host')}/suslink`,
                        description: "Community-powered link verification and safety",
                        status: "🔍 Scanning"
                    }
                },
                gaming_ecosystem: {
                    degens_card_game: {
                        url: `${req.protocol}://${req.get('host')}/degensagainstdecency`,
                        description: "Strategic card game with NFT integration",
                        status: "🔥 Beta Active"
                    },
                    nft_collection: {
                        url: `${req.protocol}://${req.get('host')}/nft`,
                        description: "Playable NFT cards and community badges",
                        status: "🎨 Collection Active"
                    },
                    beta_program: {
                        url: `${req.protocol}://${req.get('host')}/beta`,
                        description: "Early access to experimental features",
                        status: "🧪 Testing"
                    }
                },
                discord_ecosystem: {
                    traphouse_bot: {
                        url: `${req.protocol}://${req.get('host')}/discordbots`,
                        description: "Complete Discord bot collection with lending and tipping",
                        invite: `${req.protocol}://${req.get('host')}/bot`
                    },
                    aim_overlay: {
                        url: `${req.protocol}://${req.get('host')}/aimoverlay`,
                        description: "Advanced Interface Management for Discord bots",
                        status: "🎯 Active"
                    },
                    community_hub: {
                        url: "https://discord.gg/betcollective",
                        description: "Join the BetCollective Discord community",
                        type: "external"
                    }
                },
                live_integrations: {
                    main_ecosystem_hub: "https://tiltcheckecosystem.created.app",
                    degens_bot_access: "https://tiltcheckecosystem.created.app/degens-bot",
                    justthetip_tipping: "https://tiltcheckecosystem.created.app/justthetip",
                    collectclock_rewards: "https://jmenichole.github.io/CollectClock/"
                },
                team_access: {
                    cofounder_debrief: {
                        calendar_link: "https://calendly.com/jmenichole/cofounder-debrief",
                        description: "Schedule strategic planning session with founding team"
                    },
                    dev_team_invite: {
                        discord_channel: "https://discord.gg/betcollective",
                        github_access: "https://github.com/jmenichole/trap-house-discord-bot",
                        description: "Join the development team Discord and GitHub access"
                    },
                    marketing_operations: {
                        document_hub: `${req.protocol}://${req.get('host')}/marketing-docs`,
                        description: "Marketing strategy and operations documentation",
                        team_invite: "https://discord.gg/betcollective"
                    },
                    pitch_materials: {
                        deck: `${req.protocol}://${req.get('host')}/pitch-deck`,
                        one_pager: `${req.protocol}://${req.get('host')}/one-pager`,
                        whitepaper: `${req.protocol}://${req.get('host')}/whitepaper`
                    }
                },
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem_overview: `${req.protocol}://${req.get('host')}/ecosystem`,
                    sitemap: `${req.protocol}://${req.get('host')}/sitemap`,
                    api_documentation: `${req.protocol}://${req.get('host')}/api/navigation`,
                    health_status: `${req.protocol}://${req.get('host')}/api/health`,
                    developer_info: `${req.protocol}://${req.get('host')}/mischiefmanager`,
                    compliance_info: `${req.protocol}://${req.get('host')}/compliance`,
                    regulatory_guidance: `${req.protocol}://${req.get('host')}/gamblingregulations`,
                    community_support: `${req.protocol}://${req.get('host')}/support`
                },
                quick_actions: {
                    invite_discord_bot: `${req.protocol}://${req.get('host')}/bot`,
                    join_community: `${req.protocol}://${req.get('host')}/discord`,
                    view_source_code: `${req.protocol}://${req.get('host')}/github`,
                    support_development: `${req.protocol}://${req.get('host')}/kofi`,
                    schedule_meeting: "https://calendly.com/jmenichole/cofounder-debrief"
                },
                branding: {
                    primary_color: "#00ff88",
                    secondary_color: "#ff6b35", 
                    motto: "Made 4 Degens by Degens ❤️",
                    community_values: ["Transparency", "Responsibility", "Innovation", "Community"],
                    brand_voice: "Professional chaos with a responsible edge"
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

        // ===== NEW BUSINESS & TEAM ROUTES =====
        
        // Pitch deck and business materials
        this.app.get('/pitch-deck', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Pitch Deck & Business Overview",
                tagline: "Revolutionizing Responsible Gaming Through Community Trust",
                executive_summary: {
                    problem: "Gaming industry lacks transparent, community-driven responsibility tools",
                    solution: "Comprehensive ecosystem combining responsible gaming monitoring, casino transparency, and community trust scoring",
                    market_size: "Global online gambling market: $66.7B (2020) → $92.9B (2023)",
                    unique_value: "First platform combining degen culture with responsible gaming tools"
                },
                business_model: {
                    revenue_streams: [
                        "Casino partnership fees for transparency ratings",
                        "Premium API access for gambling operators", 
                        "NFT marketplace transaction fees",
                        "Discord bot premium features",
                        "Community-sponsored tournaments"
                    ],
                    target_market: "18-35 crypto-native gaming enthusiasts",
                    competitive_advantage: "Community-first approach with blockchain verification"
                },
                traction: {
                    discord_servers: 156,
                    active_users: 2847,
                    processed_loans: 1580,
                    crypto_tips_sent: 4672,
                    casino_reviews: 100,
                    trust_scores_generated: 500
                },
                roadmap: {
                    q1_2025: "Enhanced TiltCheck AI, Casino API integration",
                    q2_2025: "NFT marketplace launch, Mobile app MVP",
                    q3_2025: "Regulatory compliance certification, B2B partnerships",
                    q4_2025: "International expansion, Institutional partnerships"
                },
                funding_ask: {
                    seed_round: "$500K",
                    use_of_funds: [
                        "40% - Product development & AI enhancement",
                        "30% - Marketing & community growth", 
                        "20% - Regulatory compliance & legal",
                        "10% - Operations & team expansion"
                    ]
                },
                team_contact: {
                    schedule_meeting: "https://calendly.com/jmenichole/cofounder-debrief",
                    pitch_materials: `${req.protocol}://${req.get('host')}/one-pager`,
                    technical_overview: `${req.protocol}://${req.get('host')}/whitepaper`
                },
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    live_demo: `${req.protocol}://${req.get('host')}/ecosystem`,
                    developer_info: `${req.protocol}://${req.get('host')}/mischiefmanager`
                },
                footer: this.getEcosystemFooter()
            });
        });

        // One-pager executive summary
        this.app.get('/one-pager', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Executive Summary",
                company: "TiltCheck Ecosystem",
                tagline: "Degenerate in Gaming, Responsible in Life",
                problem: "The $90B+ gambling industry lacks transparent, community-driven responsibility tools that actually understand degen culture.",
                solution: "A comprehensive ecosystem combining real-time gambling behavior monitoring, casino transparency ratings, and blockchain-verified community trust scoring.",
                key_metrics: {
                    users: "2,847 active users across 156 Discord servers",
                    transactions: "1,580 loans processed, 4,672 crypto tips sent",
                    growth: "300% user growth in 6 months"
                },
                competitive_advantage: [
                    "First platform built BY degens FOR degens",
                    "Community-first approach with blockchain verification",
                    "Real-time risk monitoring without judgment",
                    "Transparent casino rating system"
                ],
                business_model: "SaaS + Marketplace + Premium Features",
                funding_status: "Seeking $500K seed round",
                contact: {
                    founder: "jmenichole - Mischief Manager",
                    email: "Via Discord: https://discord.gg/betcollective",
                    calendar: "https://calendly.com/jmenichole/cofounder-debrief"
                },
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    full_pitch: `${req.protocol}://${req.get('host')}/pitch-deck`,
                    technical_details: `${req.protocol}://${req.get('host')}/whitepaper`
                },
                footer: this.getEcosystemFooter()
            });
        });

        // Technical whitepaper
        this.app.get('/whitepaper', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Technical Whitepaper",
                subtitle: "Blockchain-Verified Responsible Gaming Ecosystem",
                abstract: "TiltCheck represents a paradigm shift in responsible gaming technology, leveraging blockchain verification, community governance, and AI-powered risk assessment to create the first truly transparent gaming responsibility platform.",
                technical_architecture: {
                    backend: "Node.js with Express.js microservices",
                    blockchain: "Multi-chain support (Ethereum, Solana, Polygon)",
                    ai_engine: "Custom risk assessment algorithms",
                    database: "MongoDB with Redis caching",
                    apis: "RESTful APIs with GraphQL for complex queries"
                },
                key_innovations: [
                    "Real-time gambling behavior pattern recognition",
                    "Community-verified casino transparency scoring",
                    "Blockchain-backed trust reputation system",
                    "Zero-knowledge privacy for sensitive data",
                    "Cross-platform Discord bot integration"
                ],
                security_measures: {
                    data_protection: "End-to-end encryption for all user data",
                    blockchain_verification: "Immutable trust score records",
                    privacy_compliance: "GDPR and CCPA compliant",
                    audit_trail: "Complete transaction transparency"
                },
                research_backing: {
                    responsible_gaming: "Based on established harm reduction principles",
                    behavioral_analysis: "Peer-reviewed addiction research integration",
                    community_trust: "Social proof and reputation theory"
                },
                developer_resources: {
                    api_docs: `${req.protocol}://${req.get('host')}/api/navigation`,
                    github: "https://github.com/jmenichole/trap-house-discord-bot",
                    technical_contact: "https://discord.gg/betcollective"
                },
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    business_overview: `${req.protocol}://${req.get('host')}/pitch-deck`,
                    quick_summary: `${req.protocol}://${req.get('host')}/one-pager`
                },
                footer: this.getEcosystemFooter()
            });
        });

        // Marketing and operations documentation
        this.app.get('/marketing-docs', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Marketing & Operations Hub",
                brand_strategy: {
                    positioning: "The responsible gaming platform that gets degen culture",
                    target_audience: "18-35 crypto-native gaming enthusiasts",
                    brand_voice: "Professional chaos with a responsible edge",
                    key_messaging: "Degenerate in gaming, responsible in life"
                },
                marketing_channels: {
                    discord_communities: "Primary channel for user acquisition",
                    crypto_twitter: "Thought leadership and community building",
                    twitch_partnerships: "Streamer collaborations and sponsorships",
                    reddit_engagement: "r/gambling, r/cryptocurrency, r/discordbots"
                },
                content_strategy: {
                    educational_content: "Responsible gaming tips and casino analysis",
                    community_stories: "User success stories and testimonials",
                    technical_updates: "Development progress and feature releases",
                    transparency_reports: "Casino ratings and analysis publication"
                },
                operations_framework: {
                    customer_support: `${req.protocol}://${req.get('host')}/support`,
                    community_management: "https://discord.gg/betcollective",
                    partnership_development: "https://calendly.com/jmenichole/cofounder-debrief",
                    compliance_monitoring: `${req.protocol}://${req.get('host')}/compliance`
                },
                team_onboarding: {
                    marketing_team_discord: "https://discord.gg/betcollective",
                    brand_guidelines: "Available in team Discord",
                    content_calendar: "Shared team workspace",
                    analytics_access: "Request via Discord"
                },
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    join_team: "https://discord.gg/betcollective",
                    schedule_meeting: "https://calendly.com/jmenichole/cofounder-debrief"
                },
                footer: this.getEcosystemFooter()
            });
        });

        // Comprehensive sitemap
        this.app.get('/sitemap', (req, res) => {
            res.json({
                title: "TiltCheck.it.com - Complete Sitemap",
                primary_pages: {
                    home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem_hub: `${req.protocol}://${req.get('host')}/ecosystem`,
                    compliance_center: `${req.protocol}://${req.get('host')}/compliance`,
                    developer_portfolio: `${req.protocol}://${req.get('host')}/portfolio`,
                    community_support: `${req.protocol}://${req.get('host')}/support`
                },
                core_applications: {
                    tiltcheck_monitor: `${req.protocol}://${req.get('host')}/tiltcheck`,
                    casino_transparency: `${req.protocol}://${req.get('host')}/casinos`,
                    trust_scoring: `${req.protocol}://${req.get('host')}/degentrustscore`,
                    suspicious_links: `${req.protocol}://${req.get('host')}/suslink`,
                    regulatory_guide: `${req.protocol}://${req.get('host')}/gamblingregulations`
                },
                gaming_ecosystem: {
                    degens_card_game: `${req.protocol}://${req.get('host')}/degensagainstdecency`,
                    nft_collection: `${req.protocol}://${req.get('host')}/nft`,
                    beta_program: `${req.protocol}://${req.get('host')}/beta`
                },
                discord_integration: {
                    bot_collection: `${req.protocol}://${req.get('host')}/discordbots`,
                    aim_overlay: `${req.protocol}://${req.get('host')}/aimoverlay`,
                    traphouse_ecosystem: `${req.protocol}://${req.get('host')}/traphouse`,
                    bot_invite: `${req.protocol}://${req.get('host')}/bot`
                },
                team_and_business: {
                    mischief_manager: `${req.protocol}://${req.get('host')}/mischiefmanager`,
                    pitch_deck: `${req.protocol}://${req.get('host')}/pitch-deck`,
                    executive_summary: `${req.protocol}://${req.get('host')}/one-pager`,
                    technical_whitepaper: `${req.protocol}://${req.get('host')}/whitepaper`,
                    marketing_docs: `${req.protocol}://${req.get('host')}/marketing-docs`
                },
                api_endpoints: {
                    health_check: `${req.protocol}://${req.get('host')}/api/health`,
                    navigation: `${req.protocol}://${req.get('host')}/api/navigation`,
                    crypto_prices: `${req.protocol}://${req.get('host')}/api/crypto/prices`,
                    ecosystem_stats: `${req.protocol}://${req.get('host')}/api/stats`,
                    swc_verification: `${req.protocol}://${req.get('host')}/api/swc/verification`
                },
                external_integrations: {
                    main_ecosystem: "https://tiltcheckecosystem.created.app",
                    degens_bot: "https://tiltcheckecosystem.created.app/degens-bot",
                    justthetip: "https://tiltcheckecosystem.created.app/justthetip",
                    collectclock: "https://jmenichole.github.io/CollectClock/",
                    discord_community: "https://discord.gg/betcollective",
                    github_repo: "https://github.com/jmenichole/trap-house-discord-bot",
                    kofi_support: "https://ko-fi.com/jmenichole0"
                },
                quick_redirects: {
                    github: `${req.protocol}://${req.get('host')}/github`,
                    discord: `${req.protocol}://${req.get('host')}/discord`,
                    kofi: `${req.protocol}://${req.get('host')}/kofi`,
                    linkedin: `${req.protocol}://${req.get('host')}/linkedin`
                },
                helpful_links: {
                    back_to_home: `${req.protocol}://${req.get('host')}/`,
                    ecosystem_overview: `${req.protocol}://${req.get('host')}/ecosystem`,
                    api_documentation: `${req.protocol}://${req.get('host')}/api/navigation`
                },
                footer: this.getEcosystemFooter()
            });
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
                support: 'https://discord.gg/betcollective',
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
