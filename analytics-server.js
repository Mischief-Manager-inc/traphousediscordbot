#!/usr/bin/env node

/**
 * TiltCheck Analytics Server
 * Real-time analytics dashboard for the TiltCheck ecosystem
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
const fs = require('fs').promises;

class AnalyticsServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.port = process.env.ANALYTICS_PORT || 3336;
        this.mongoClient = null;
        this.analytics = {
            users: { total: 0, active: 0, beta: 0 },
            contracts: { signed: 0, pending: 0 },
            nfts: { minted: 0, verified: 0 },
            sessions: { current: 0, total: 0 },
            performance: { avgResponseTime: 0, uptime: Date.now() }
        };
        
        this.init();
    }

    async init() {
        try {
            // Initialize MongoDB if available
            await this.initializeMongoDB();
            
            // Setup middleware
            this.setupMiddleware();
            
            // Setup routes
            this.setupRoutes();
            
            // Setup WebSocket handlers
            this.setupWebSocket();
            
            // Start analytics collection
            this.startAnalyticsCollection();
            
            // Start server
            this.server.listen(this.port, () => {
                console.log(`
🚀 TiltCheck Analytics Server Started
📍 Server: http://localhost:${this.port}
📊 Dashboard: http://localhost:${this.port}/dashboard
🔄 Real-time updates via WebSocket
💾 MongoDB integration: ${this.mongoClient ? 'Connected' : 'Local storage'}
                `);
            });
            
        } catch (error) {
            console.error('❌ Failed to start analytics server:', error);
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
                console.log('✅ Analytics MongoDB connected');
            }
        } catch (error) {
            console.log('⚠️  Analytics using local storage (MongoDB unavailable)');
            this.mongoClient = null;
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
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                analytics: this.analytics,
                mongodb: this.mongoClient ? 'connected' : 'disconnected'
            });
        });

        // Analytics dashboard
        this.app.get('/dashboard', (req, res) => {
            res.send(this.generateDashboardHTML());
        });

        // Analytics API endpoints
        this.app.get('/api/analytics', (req, res) => {
            res.json(this.analytics);
        });

        this.app.get('/api/analytics/contracts', async (req, res) => {
            try {
                const contractData = await this.getContractAnalytics();
                res.json(contractData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/analytics/nfts', async (req, res) => {
            try {
                const nftData = await this.getNFTAnalytics();
                res.json(nftData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/analytics/performance', async (req, res) => {
            try {
                const perfData = await this.getPerformanceAnalytics();
                res.json(perfData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Event tracking endpoint
        this.app.post('/api/track', async (req, res) => {
            try {
                await this.trackEvent(req.body);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    setupWebSocket() {
        this.io.on('connection', (socket) => {
            console.log(`📡 Analytics client connected: ${socket.id}`);
            
            // Send current analytics
            socket.emit('analytics-update', this.analytics);
            
            socket.on('disconnect', () => {
                console.log(`📡 Analytics client disconnected: ${socket.id}`);
            });
        });
    }

    startAnalyticsCollection() {
        // Update analytics every 10 seconds
        setInterval(async () => {
            await this.updateAnalytics();
            this.io.emit('analytics-update', this.analytics);
        }, 10000);

        // Collect performance metrics every minute
        setInterval(async () => {
            await this.collectPerformanceMetrics();
        }, 60000);
    }

    async updateAnalytics() {
        try {
            // Update contract analytics
            const contractAnalytics = await this.getContractAnalytics();
            this.analytics.contracts = contractAnalytics;

            // Update NFT analytics
            const nftAnalytics = await this.getNFTAnalytics();
            this.analytics.nfts = nftAnalytics;

            // Update performance metrics
            this.analytics.performance.uptime = Date.now() - this.analytics.performance.uptime;

        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }

    async getContractAnalytics() {
        try {
            // Try to read from MongoDB first, then fall back to file system
            if (this.mongoClient) {
                const db = this.mongoClient.db('beta_testing');
                const contracts = db.collection('contracts');
                
                const signed = await contracts.countDocuments({ status: 'signed' });
                const pending = await contracts.countDocuments({ status: 'pending' });
                
                return { signed, pending, total: signed + pending };
            } else {
                // Fall back to file system
                const contractsPath = path.join(__dirname, 'data', 'beta-contracts');
                try {
                    const files = await fs.readdir(contractsPath);
                    const contractFiles = files.filter(f => f.startsWith('contract-') && f.endsWith('.json'));
                    
                    let signed = 0, pending = 0;
                    
                    for (const file of contractFiles) {
                        try {
                            const data = await fs.readFile(path.join(contractsPath, file), 'utf8');
                            const contract = JSON.parse(data);
                            if (contract.status === 'signed') signed++;
                            else if (contract.status === 'pending') pending++;
                        } catch (error) {
                            continue;
                        }
                    }
                    
                    return { signed, pending, total: signed + pending };
                } catch (error) {
                    return { signed: 0, pending: 0, total: 0 };
                }
            }
        } catch (error) {
            return { signed: 0, pending: 0, total: 0 };
        }
    }

    async getNFTAnalytics() {
        try {
            if (this.mongoClient) {
                const db = this.mongoClient.db('nft_contracts');
                const nfts = db.collection('ownership_records');
                
                const minted = await nfts.countDocuments({});
                const verified = await nfts.countDocuments({ status: 'active' });
                
                return { minted, verified, total: minted };
            } else {
                // Fall back to file system
                const nftPath = path.join(__dirname, 'data', 'nft-ownership');
                try {
                    const files = await fs.readdir(nftPath);
                    const nftFiles = files.filter(f => f.endsWith('.json'));
                    
                    let minted = nftFiles.length;
                    let verified = 0;
                    
                    for (const file of nftFiles) {
                        try {
                            const data = await fs.readFile(path.join(nftPath, file), 'utf8');
                            const nft = JSON.parse(data);
                            if (nft.status === 'active') verified++;
                        } catch (error) {
                            continue;
                        }
                    }
                    
                    return { minted, verified, total: minted };
                } catch (error) {
                    return { minted: 0, verified: 0, total: 0 };
                }
            }
        } catch (error) {
            return { minted: 0, verified: 0, total: 0 };
        }
    }

    async getPerformanceAnalytics() {
        return {
            uptime: Math.floor((Date.now() - this.analytics.performance.uptime) / 1000),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            timestamp: new Date().toISOString()
        };
    }

    async collectPerformanceMetrics() {
        const metrics = await this.getPerformanceAnalytics();
        
        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('analytics_data');
                const collection = db.collection('performance');
                await collection.insertOne(metrics);
            } catch (error) {
                console.error('Failed to save performance metrics:', error);
            }
        }
    }

    async trackEvent(eventData) {
        const event = {
            ...eventData,
            timestamp: new Date().toISOString(),
            source: 'tiltcheck-ecosystem'
        };

        if (this.mongoClient) {
            try {
                const db = this.mongoClient.db('analytics_data');
                const collection = db.collection('events');
                await collection.insertOne(event);
            } catch (error) {
                console.error('Failed to track event:', error);
            }
        }

        // Emit event to connected clients
        this.io.emit('new-event', event);
    }

    generateDashboardHTML() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TiltCheck Analytics Dashboard</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #ffffff;
            margin: 0;
            padding: 20px;
        }
        .dashboard {
            max-width: 1200px;
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
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        .metric-card h3 {
            color: #00ff00;
            margin: 0 0 10px 0;
            font-size: 1.2rem;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #ffffff;
        }
        .metric-label {
            color: #cccccc;
            font-size: 0.9rem;
        }
        .chart-container {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
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
        .real-time-events {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 10px;
            padding: 20px;
            height: 300px;
            overflow-y: auto;
        }
        .event-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }
        .timestamp {
            color: #00ff00;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🎮 TiltCheck Analytics Dashboard</h1>
            <p><span class="status-indicator status-online"></span>Real-time monitoring active</p>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <h3>📋 Contracts</h3>
                <div class="metric-value" id="contracts-signed">0</div>
                <div class="metric-label">Signed Contracts</div>
            </div>
            
            <div class="metric-card">
                <h3>🎮 NFTs</h3>
                <div class="metric-value" id="nfts-minted">0</div>
                <div class="metric-label">Minted NFTs</div>
            </div>
            
            <div class="metric-card">
                <h3>⏱️ Uptime</h3>
                <div class="metric-value" id="uptime">0s</div>
                <div class="metric-label">System Uptime</div>
            </div>
            
            <div class="metric-card">
                <h3>👥 Users</h3>
                <div class="metric-value" id="active-users">0</div>
                <div class="metric-label">Active Beta Users</div>
            </div>
        </div>

        <div class="chart-container">
            <h3 style="color: #00ff00; margin-top: 0;">📊 System Performance</h3>
            <div id="performance-chart">
                <p>Memory Usage: <span id="memory-usage">0 MB</span></p>
                <p>CPU Usage: <span id="cpu-usage">0%</span></p>
                <p>MongoDB Status: <span id="mongodb-status">Unknown</span></p>
            </div>
        </div>

        <div class="real-time-events">
            <h3 style="color: #00ff00; margin-top: 0;">🔄 Real-time Events</h3>
            <div id="events-container">
                <div class="event-item">
                    <span class="timestamp">[Waiting for events...]</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        const socket = io();
        
        socket.on('analytics-update', (data) => {
            updateMetrics(data);
        });
        
        socket.on('new-event', (event) => {
            addEvent(event);
        });
        
        function updateMetrics(analytics) {
            document.getElementById('contracts-signed').textContent = analytics.contracts?.signed || 0;
            document.getElementById('nfts-minted').textContent = analytics.nfts?.minted || 0;
            document.getElementById('uptime').textContent = formatUptime(analytics.performance?.uptime || 0);
            document.getElementById('active-users').textContent = analytics.users?.active || 0;
        }
        
        function formatUptime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return hours > 0 ? \`\${hours}h \${minutes}m\` : \`\${minutes}m \${secs}s\`;
        }
        
        function addEvent(event) {
            const container = document.getElementById('events-container');
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-item';
            eventDiv.innerHTML = \`
                <span class="timestamp">[\${new Date(event.timestamp).toLocaleTimeString()}]</span>
                \${event.type || 'Event'}: \${event.message || JSON.stringify(event)}
            \`;
            container.insertBefore(eventDiv, container.firstChild);
            
            // Keep only last 20 events
            while (container.children.length > 20) {
                container.removeChild(container.lastChild);
            }
        }
        
        // Fetch initial data
        fetch('/api/analytics')
            .then(response => response.json())
            .then(data => updateMetrics(data))
            .catch(error => console.error('Failed to fetch analytics:', error));
    </script>
</body>
</html>`;
    }
}

// Start the analytics server
if (require.main === module) {
    new AnalyticsServer();
}

module.exports = AnalyticsServer;
