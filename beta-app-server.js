#!/usr/bin/env node

/**
 * TiltCheck Beta App Server
 * Handles beta user authentication, NFT verification, and contract management
 * for the TiltCheck ecosystem
 */

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

class BetaAppServer {
    constructor() {
        this.app = express();
        this.port = process.env.BETA_APP_PORT || 3335;
        this.mongoClient = null;
        
        // Beta user management
        this.approvedDiscordIds = new Set([
            '115681066538237953',  // Primary owner
            '228742205018210304',  // Admin access
            '1077399941951012864', // Beta user 1
            '261235347038535682',  // Beta user 2
            '898170764447072336'   // Beta user 3
        ]);
        
        this.activeSessions = new Map();
        
        this.init();
    }

    async init() {
        try {
            // Initialize MongoDB
            await this.initializeMongoDB();
            
            // Setup middleware
            this.setupMiddleware();
            
            // Setup routes
            this.setupRoutes();
            
            // Start server
            this.app.listen(this.port, () => {
                console.log(`
🎮 TiltCheck Beta App Server Started
📍 Server: http://localhost:${this.port}
🔐 Authentication: Discord ID verification
📋 Contract system: Active
🎨 NFT system: Active
💾 MongoDB: ${this.mongoClient ? 'Connected' : 'Local storage'}
                `);
            });
            
        } catch (error) {
            console.error('❌ Failed to start beta app server:', error);
            process.exit(1);
        }
    }

    async initializeMongoDB() {
        try {
            if (process.env.MONGODB_URI && process.env.MONGODB_CERT_PATH) {
                this.mongoClient = new MongoClient(process.env.MONGODB_URI, {
                    tlsCertificateKeyFile: process.env.MONGODB_CERT_PATH,
                    serverApi: ServerApiVersion.v1
                });
                
                await this.mongoClient.connect();
                console.log('✅ Beta App MongoDB connected');
                
                // Ensure collections exist
                await this.setupCollections();
            }
        } catch (error) {
            console.log('⚠️  Beta App using local storage (MongoDB unavailable)');
            this.mongoClient = null;
        }
    }

    async setupCollections() {
        if (!this.mongoClient) return;
        
        try {
            const db = this.mongoClient.db('beta_testing');
            
            // Create collections if they don't exist
            const collections = ['contracts', 'sessions', 'user_data', 'nft_ownership'];
            for (const collectionName of collections) {
                try {
                    await db.createCollection(collectionName);
                } catch (error) {
                    // Collection might already exist
                }
            }
            
            // Create indexes
            await db.collection('contracts').createIndex({ discordId: 1 });
            await db.collection('sessions').createIndex({ sessionId: 1 });
            await db.collection('user_data').createIndex({ discordId: 1 });
            await db.collection('nft_ownership').createIndex({ discordId: 1 });
            
        } catch (error) {
            console.error('Error setting up collections:', error);
        }
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        
        // Session validation middleware
        this.app.use('/api/protected/*', this.validateSession.bind(this));
    }

    async validateSession(req, res, next) {
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(401).json({ error: 'Session ID required' });
        }
        
        try {
            const session = await this.getSession(sessionId);
            if (!session || session.expired) {
                return res.status(401).json({ error: 'Invalid or expired session' });
            }
            
            req.session = session;
            next();
        } catch (error) {
            res.status(500).json({ error: 'Session validation failed' });
        }
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                mongodb: this.mongoClient ? 'connected' : 'disconnected',
                activeSessions: this.activeSessions.size,
                approvedUsers: this.approvedDiscordIds.size
            });
        });

        // Beta authentication
        this.app.post('/api/auth/beta-login', async (req, res) => {
            try {
                const { discordId, deviceFingerprint, signature } = req.body;
                
                // Validate Discord ID
                if (!this.approvedDiscordIds.has(discordId)) {
                    return res.status(403).json({ 
                        error: 'Not approved for beta testing',
                        discordId: discordId,
                        approvedUsers: Array.from(this.approvedDiscordIds)
                    });
                }
                
                // Create session
                const session = await this.createSession(discordId, deviceFingerprint);
                
                res.json({
                    success: true,
                    sessionId: session.sessionId,
                    expiresAt: session.expiresAt,
                    betaUser: true,
                    discordId: discordId
                });
                
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Contract management
        this.app.get('/api/protected/contract/:discordId', async (req, res) => {
            try {
                const { discordId } = req.params;
                const contract = await this.getContract(discordId);
                res.json(contract || { exists: false, discordId });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/protected/contract/sign', async (req, res) => {
            try {
                const { discordId, signature, terms } = req.body;
                const contract = await this.signContract(discordId, signature, terms);
                res.json(contract);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // NFT verification
        this.app.get('/api/protected/nft/:discordId', async (req, res) => {
            try {
                const { discordId } = req.params;
                const nft = await this.getNFTStatus(discordId);
                res.json(nft);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/protected/nft/mint', async (req, res) => {
            try {
                const { discordId } = req.body;
                const nft = await this.mintBetaNFT(discordId);
                res.json(nft);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // User data management
        this.app.get('/api/protected/user/:discordId', async (req, res) => {
            try {
                const { discordId } = req.params;
                const userData = await this.getUserData(discordId);
                res.json(userData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/protected/user/update', async (req, res) => {
            try {
                const { discordId, data } = req.body;
                const updated = await this.updateUserData(discordId, data);
                res.json(updated);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Beta testing dashboard
        this.app.get('/dashboard', (req, res) => {
            res.send(this.generateDashboardHTML());
        });

        // Contract verification endpoint
        this.app.get('/api/verify-contract/:discordId', async (req, res) => {
            try {
                const { discordId } = req.params;
                const contract = await this.getContract(discordId);
                const nft = await this.getNFTStatus(discordId);
                
                res.json({
                    contractExists: !!contract,
                    contractSigned: contract?.status === 'signed',
                    nftExists: nft?.exists !== false,
                    verified: !!contract && contract.status === 'signed' && nft?.exists !== false,
                    discordId
                });
            } catch (error) {
                res.status(500).json({ error: error.message, verified: false });
            }
        });
    }

    async createSession(discordId, deviceFingerprint) {
        const sessionId = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        const session = {
            sessionId,
            discordId,
            deviceFingerprint,
            createdAt: new Date(),
            expiresAt,
            expired: false
        };
        
        this.activeSessions.set(sessionId, session);
        
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                await db.collection('sessions').insertOne(session);
            } catch (error) {
                console.error('Failed to save session to MongoDB:', error);
            }
        }
        
        return session;
    }

    async getSession(sessionId) {
        // Check in-memory first
        if (this.activeSessions.has(sessionId)) {
            const session = this.activeSessions.get(sessionId);
            if (session.expiresAt > new Date()) {
                return session;
            } else {
                this.activeSessions.delete(sessionId);
            }
        }
        
        // Check MongoDB
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                const session = await db.collection('sessions').findOne({ sessionId });
                
                if (session && session.expiresAt > new Date()) {
                    this.activeSessions.set(sessionId, session);
                    return session;
                }
            } catch (error) {
                console.error('Failed to get session from MongoDB:', error);
            }
        }
        
        return null;
    }

    async getContract(discordId) {
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                return await db.collection('contracts').findOne({ discordId });
            } catch (error) {
                console.error('Failed to get contract from MongoDB:', error);
            }
        }
        
        // Fall back to file system
        try {
            const contractPath = path.join(__dirname, 'data', 'beta-contracts', `contract-${discordId}.json`);
            const data = await fs.readFile(contractPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    async signContract(discordId, signature, terms) {
        const contract = {
            discordId,
            signature,
            terms,
            status: 'signed',
            signedAt: new Date(),
            contractHash: crypto.createHash('sha256').update(`${discordId}-${signature}-${Date.now()}`).digest('hex'),
            metadata: {
                userAgent: 'TiltCheck-Beta-App',
                ipAddress: 'localhost',
                version: '1.0.0'
            }
        };
        
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                await db.collection('contracts').updateOne(
                    { discordId },
                    { $set: contract },
                    { upsert: true }
                );
            } catch (error) {
                console.error('Failed to save contract to MongoDB:', error);
            }
        }
        
        // Also save to file system as backup
        try {
            const contractsDir = path.join(__dirname, 'data', 'beta-contracts');
            await fs.mkdir(contractsDir, { recursive: true });
            const contractPath = path.join(contractsDir, `contract-${discordId}.json`);
            await fs.writeFile(contractPath, JSON.stringify(contract, null, 2));
        } catch (error) {
            console.error('Failed to save contract to file system:', error);
        }
        
        return contract;
    }

    async getNFTStatus(discordId) {
        // Check MongoDB first
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                const nft = await db.collection('nft_ownership').findOne({ discordId });
                if (nft) return nft;
            } catch (error) {
                console.error('Failed to get NFT from MongoDB:', error);
            }
        }
        
        // Check file system
        try {
            const nftPath = path.join(__dirname, 'data', 'nft-ownership', `nft-${discordId}.json`);
            const data = await fs.readFile(nftPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return { exists: false, discordId };
        }
    }

    async mintBetaNFT(discordId) {
        // Create NFT data
        const nftData = {
            discordId,
            tokenId: crypto.randomBytes(16).toString('hex'),
            contractAddress: '0x' + crypto.randomBytes(20).toString('hex'),
            mintedAt: new Date(),
            status: 'active',
            exists: true,
            metadata: {
                name: `TiltCheck Beta NFT #${discordId.slice(-8)}`,
                description: 'Exclusive NFT for TiltCheck beta testers - serves as contract signature and verification',
                image: `data:image/svg+xml;base64,${this.generateNFTSVG(discordId)}`,
                external_url: `https://tiltcheck.com/nft/${discordId}`,
                attributes: [
                    { trait_type: 'Type', value: 'Beta Tester' },
                    { trait_type: 'Discord ID', value: discordId },
                    { trait_type: 'Minted', value: new Date().toISOString().split('T')[0] },
                    { trait_type: 'Rarity', value: 'Legendary' },
                    { trait_type: 'Access Level', value: 'Beta' }
                ]
            }
        };
        
        // Save to MongoDB
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                await db.collection('nft_ownership').updateOne(
                    { discordId },
                    { $set: nftData },
                    { upsert: true }
                );
            } catch (error) {
                console.error('Failed to save NFT to MongoDB:', error);
            }
        }
        
        // Save NFT data to file system as backup
        try {
            const nftDir = path.join(__dirname, 'data', 'nft-ownership');
            await fs.mkdir(nftDir, { recursive: true });
            const nftPath = path.join(nftDir, `nft-${discordId}.json`);
            await fs.writeFile(nftPath, JSON.stringify(nftData, null, 2));
        } catch (error) {
            console.error('Failed to save NFT data to file system:', error);
            throw error;
        }
        
        return nftData;
    }

    generateNFTSVG(discordId) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const color = colors[parseInt(discordId.slice(-1), 16) % colors.length];
        
        const svg = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a"/>
            <stop offset="50%" style="stop-color:#1a1a2e"/>
            <stop offset="100%" style="stop-color:#16213e"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color}"/>
            <stop offset="100%" style="stop-color:#00ff00"/>
        </linearGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <rect width="400" height="400" fill="url(#bg)"/>
    
    <circle cx="200" cy="150" r="80" fill="none" stroke="url(#accent)" stroke-width="4" filter="url(#glow)"/>
    <text x="200" y="165" text-anchor="middle" fill="url(#accent)" font-family="Arial" font-size="36" font-weight="bold">🎮</text>
    
    <text x="200" y="250" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="20" font-weight="bold">TiltCheck Beta</text>
    <text x="200" y="280" text-anchor="middle" fill="url(#accent)" font-family="Arial" font-size="16">ID: ${discordId.slice(-8)}</text>
    
    <rect x="50" y="320" width="300" height="3" fill="url(#accent)" opacity="0.7"/>
    <text x="200" y="350" text-anchor="middle" fill="#cccccc" font-family="Arial" font-size="12">Exclusive Beta Tester NFT</text>
    <text x="200" y="370" text-anchor="middle" fill="#888888" font-family="Arial" font-size="10">Contract Signature & Verification</text>
</svg>`;
        
        return Buffer.from(svg).toString('base64');
    }

    async getUserData(discordId) {
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                const userData = await db.collection('user_data').findOne({ discordId });
                if (userData) return userData;
            } catch (error) {
                console.error('Failed to get user data from MongoDB:', error);
            }
        }
        
        // Fall back to file system
        try {
            const userPath = path.join(__dirname, 'data', 'users', `user-${discordId}.json`);
            const data = await fs.readFile(userPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return { 
                discordId, 
                createdAt: new Date(),
                betaUser: this.approvedDiscordIds.has(discordId)
            };
        }
    }

    async updateUserData(discordId, data) {
        const userData = {
            discordId,
            ...data,
            updatedAt: new Date(),
            betaUser: this.approvedDiscordIds.has(discordId)
        };
        
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('beta_testing');
                await db.collection('user_data').updateOne(
                    { discordId },
                    { $set: userData },
                    { upsert: true }
                );
            } catch (error) {
                console.error('Failed to update user data in MongoDB:', error);
            }
        }
        
        // Also save to file system
        try {
            const usersDir = path.join(__dirname, 'data', 'users');
            await fs.mkdir(usersDir, { recursive: true });
            const userPath = path.join(usersDir, `user-${discordId}.json`);
            await fs.writeFile(userPath, JSON.stringify(userData, null, 2));
        } catch (error) {
            console.error('Failed to save user data to file system:', error);
        }
        
        return userData;
    }

    generateDashboardHTML() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TiltCheck Beta App Dashboard</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #ffffff;
            margin: 0;
            padding: 20px;
        }
        .dashboard {
            max-width: 1000px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #00ff00;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .section {
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .section h2 {
            color: #00ff00;
            margin-top: 0;
        }
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-online { background: #00ff00; }
        .status-offline { background: #ff0000; }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            color: #00ff00;
            margin-bottom: 5px;
        }
        .form-group input {
            width: calc(100% - 20px);
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 5px;
            color: #ffffff;
        }
        .btn {
            background: rgba(0, 255, 0, 0.2);
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .btn:hover {
            background: rgba(0, 255, 0, 0.3);
        }
        .result {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            padding: 15px;
            margin-top: 15px;
            white-space: pre-wrap;
            font-family: monospace;
            max-height: 300px;
            overflow-y: auto;
        }
        .approved-users {
            background: rgba(0, 255, 0, 0.05);
            border: 1px solid rgba(0, 255, 0, 0.2);
            border-radius: 5px;
            padding: 10px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🎮 TiltCheck Beta App Dashboard</h1>
            <p><span class="status-indicator status-online"></span>Beta app server active</p>
        </div>

        <div class="section">
            <h2>📋 Approved Beta Users</h2>
            <div class="approved-users">
                <strong>Approved Discord IDs:</strong><br>
                • 115681066538237953 (Primary Owner)<br>
                • 228742205018210304 (Admin Access)<br>
                • 1077399941951012864 (Beta User 1)<br>
                • 261235347038535682 (Beta User 2)<br>
                • 898170764447072336 (Beta User 3)
            </div>
        </div>

        <div class="section">
            <h2>🔐 Beta Authentication</h2>
            <div class="form-group">
                <label for="discordId">Discord ID:</label>
                <input type="text" id="discordId" placeholder="115681066538237953">
            </div>
            <div class="form-group">
                <label for="deviceFingerprint">Device Fingerprint:</label>
                <input type="text" id="deviceFingerprint" placeholder="device-fingerprint-hash">
            </div>
            <button class="btn" onclick="betaLogin()">🚀 Beta Login</button>
            <button class="btn" onclick="verifyContract()">🔍 Verify Contract</button>
            <div id="loginResult" class="result" style="display: none;"></div>
        </div>

        <div class="section">
            <h2>📋 Contract Management</h2>
            <div class="form-group">
                <label for="contractDiscordId">Discord ID:</label>
                <input type="text" id="contractDiscordId" placeholder="115681066538237953">
            </div>
            <button class="btn" onclick="getContract()">📄 Get Contract</button>
            <button class="btn" onclick="signContract()">✍️ Sign Contract</button>
            <div id="contractResult" class="result" style="display: none;"></div>
        </div>

        <div class="section">
            <h2>🎨 NFT Management</h2>
            <div class="form-group">
                <label for="nftDiscordId">Discord ID:</label>
                <input type="text" id="nftDiscordId" placeholder="115681066538237953">
            </div>
            <button class="btn" onclick="getNFT()">🎮 Get NFT Status</button>
            <button class="btn" onclick="mintNFT()">✨ Mint Beta NFT</button>
            <div id="nftResult" class="result" style="display: none;"></div>
        </div>

        <div class="section">
            <h2>👤 User Management</h2>
            <div class="form-group">
                <label for="userDiscordId">Discord ID:</label>
                <input type="text" id="userDiscordId" placeholder="115681066538237953">
            </div>
            <button class="btn" onclick="getUser()">👤 Get User Data</button>
            <button class="btn" onclick="updateUser()">💾 Update User</button>
            <div id="userResult" class="result" style="display: none;"></div>
        </div>
    </div>

    <script>
        let sessionId = null;

        async function betaLogin() {
            const discordId = document.getElementById('discordId').value;
            const deviceFingerprint = document.getElementById('deviceFingerprint').value || 'test-device-' + Date.now();
            
            if (!discordId) {
                alert('Please provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch('/api/auth/beta-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ discordId, deviceFingerprint })
                });
                
                const result = await response.json();
                document.getElementById('loginResult').style.display = 'block';
                document.getElementById('loginResult').textContent = JSON.stringify(result, null, 2);
                
                if (result.sessionId) {
                    sessionId = result.sessionId;
                    // Auto-fill other forms with the same Discord ID
                    document.getElementById('contractDiscordId').value = discordId;
                    document.getElementById('nftDiscordId').value = discordId;
                    document.getElementById('userDiscordId').value = discordId;
                }
            } catch (error) {
                document.getElementById('loginResult').style.display = 'block';
                document.getElementById('loginResult').textContent = 'Error: ' + error.message;
            }
        }

        async function verifyContract() {
            const discordId = document.getElementById('discordId').value;
            
            if (!discordId) {
                alert('Please provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch(\`/api/verify-contract/\${discordId}\`);
                const result = await response.json();
                document.getElementById('loginResult').style.display = 'block';
                document.getElementById('loginResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('loginResult').style.display = 'block';
                document.getElementById('loginResult').textContent = 'Error: ' + error.message;
            }
        }

        async function getContract() {
            const discordId = document.getElementById('contractDiscordId').value;
            
            if (!discordId || !sessionId) {
                alert('Please login first and provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch(\`/api/protected/contract/\${discordId}\`, {
                    headers: { 'x-session-id': sessionId }
                });
                
                const result = await response.json();
                document.getElementById('contractResult').style.display = 'block';
                document.getElementById('contractResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('contractResult').style.display = 'block';
                document.getElementById('contractResult').textContent = 'Error: ' + error.message;
            }
        }

        async function signContract() {
            const discordId = document.getElementById('contractDiscordId').value;
            
            if (!discordId || !sessionId) {
                alert('Please login first and provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch('/api/protected/contract/sign', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId 
                    },
                    body: JSON.stringify({
                        discordId,
                        signature: 'beta-contract-signature-' + Date.now(),
                        terms: 'TiltCheck Beta Testing Agreement - I agree to test the application and provide feedback.'
                    })
                });
                
                const result = await response.json();
                document.getElementById('contractResult').style.display = 'block';
                document.getElementById('contractResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('contractResult').style.display = 'block';
                document.getElementById('contractResult').textContent = 'Error: ' + error.message;
            }
        }

        async function getNFT() {
            const discordId = document.getElementById('nftDiscordId').value;
            
            if (!discordId || !sessionId) {
                alert('Please login first and provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch(\`/api/protected/nft/\${discordId}\`, {
                    headers: { 'x-session-id': sessionId }
                });
                
                const result = await response.json();
                document.getElementById('nftResult').style.display = 'block';
                document.getElementById('nftResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('nftResult').style.display = 'block';
                document.getElementById('nftResult').textContent = 'Error: ' + error.message;
            }
        }

        async function mintNFT() {
            const discordId = document.getElementById('nftDiscordId').value;
            
            if (!discordId || !sessionId) {
                alert('Please login first and provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch('/api/protected/nft/mint', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId 
                    },
                    body: JSON.stringify({ discordId })
                });
                
                const result = await response.json();
                document.getElementById('nftResult').style.display = 'block';
                document.getElementById('nftResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('nftResult').style.display = 'block';
                document.getElementById('nftResult').textContent = 'Error: ' + error.message;
            }
        }

        async function getUser() {
            const discordId = document.getElementById('userDiscordId').value;
            
            if (!discordId || !sessionId) {
                alert('Please login first and provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch(\`/api/protected/user/\${discordId}\`, {
                    headers: { 'x-session-id': sessionId }
                });
                
                const result = await response.json();
                document.getElementById('userResult').style.display = 'block';
                document.getElementById('userResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('userResult').style.display = 'block';
                document.getElementById('userResult').textContent = 'Error: ' + error.message;
            }
        }

        async function updateUser() {
            const discordId = document.getElementById('userDiscordId').value;
            
            if (!discordId || !sessionId) {
                alert('Please login first and provide Discord ID');
                return;
            }
            
            try {
                const response = await fetch('/api/protected/user/update', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId 
                    },
                    body: JSON.stringify({
                        discordId,
                        data: {
                            lastLogin: new Date().toISOString(),
                            testingStatus: 'active',
                            preferences: {
                                theme: 'dark',
                                notifications: true
                            }
                        }
                    })
                });
                
                const result = await response.json();
                document.getElementById('userResult').style.display = 'block';
                document.getElementById('userResult').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('userResult').style.display = 'block';
                document.getElementById('userResult').textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;
    }
}

// Start the beta app server
if (require.main === module) {
    new BetaAppServer();
}

module.exports = BetaAppServer;
