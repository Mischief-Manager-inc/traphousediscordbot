#!/usr/bin/env node

/**
 * TiltCheck Ecosystem Autostart Manager
 * Coordinates startup of all system components with MongoDB integration
 */

const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

class EcosystemAutostart {
    constructor() {
        this.services = new Map();
        this.mongoClient = null;
        this.isShuttingDown = false;
        
        // Service configuration
        this.serviceConfig = {
            'desktop-installer': {
                script: './desktop-installer-server.js',
                port: 4002,
                critical: true,
                description: 'Desktop Installer with NFT Contract System',
                env: { NODE_ENV: 'production' }
            },
            'beta-testing': {
                script: './beta-testing-server.js',
                port: 3335,
                critical: true,
                description: 'Beta Testing Environment',
                env: { BETA_PORT: '3335' }
            },
            'analytics': {
                script: './analytics-server.js',
                port: 3336,
                critical: false,
                description: 'Analytics Dashboard',
                env: { ANALYTICS_PORT: '3336' }
            },
            'main-bot': {
                script: './bot.js',
                port: null,
                critical: true,
                description: 'Main TrapHouse Discord Bot',
                env: { BOT_TYPE: 'main' }
            },
            'degens-bot': {
                script: './degens_bot.js',
                port: 3003,
                critical: false,
                description: 'Degens Gaming Bot',
                env: { BOT_TYPE: 'degens' }
            }
        };

        // MongoDB configuration
        this.mongoConfig = {
            uri: 'mongodb+srv://justhetip.0z3jtr.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=Justhetip',
            tlsCertificateKeyFile: process.env.MONGODB_CERT_PATH || './certs/mongodb-cert.pem',
            serverApi: ServerApiVersion.v1,
            databases: {
                main: 'tiltcheck_ecosystem',
                beta: 'beta_testing',
                analytics: 'analytics_data',
                nft: 'nft_contracts'
            }
        };
    }

    async initialize() {
        console.log('\n🚀 TiltCheck Ecosystem Autostart Manager');
        console.log('==========================================\n');

        try {
            // Initialize MongoDB connection
            await this.initializeMongoDB();
            
            // Setup signal handlers for graceful shutdown
            this.setupSignalHandlers();
            
            // Start all services
            await this.startAllServices();
            
            // Monitor services
            this.startHealthMonitoring();
            
            console.log('\n✅ Ecosystem startup complete!');
            console.log('🔍 Monitoring services... Press Ctrl+C to shutdown\n');

        } catch (error) {
            console.error('❌ Failed to start ecosystem:', error);
            process.exit(1);
        }
    }

    async initializeMongoDB() {
        console.log('🗄️  Initializing MongoDB connection...');
        
        try {
            // Check if certificate file exists
            try {
                await fs.access(this.mongoConfig.tlsCertificateKeyFile);
                console.log('✅ MongoDB certificate found');
            } catch (error) {
                console.log('⚠️  MongoDB certificate not found, creating placeholder...');
                await this.createMongoCertPlaceholder();
            }

            // Initialize MongoDB client
            this.mongoClient = new MongoClient(this.mongoConfig.uri, {
                tlsCertificateKeyFile: this.mongoConfig.tlsCertificateKeyFile,
                serverApi: this.mongoConfig.serverApi,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferMaxEntries: 0,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            // Test connection
            await this.mongoClient.connect();
            console.log('✅ MongoDB connected successfully');

            // Initialize databases and collections
            await this.initializeDatabases();
            
            // Keep connection alive
            await this.mongoClient.db('admin').admin().ping();
            console.log('✅ MongoDB ping successful');

        } catch (error) {
            console.error('❌ MongoDB initialization failed:', error.message);
            console.log('⚠️  Continuing without MongoDB (services will use local storage)');
            this.mongoClient = null;
        }
    }

    async createMongoCertPlaceholder() {
        const certDir = path.dirname(this.mongoConfig.tlsCertificateKeyFile);
        await fs.mkdir(certDir, { recursive: true });
        
        const placeholderContent = `# MongoDB Certificate Placeholder
# Replace this file with your actual MongoDB X.509 certificate
# 
# To get your certificate:
# 1. Go to MongoDB Atlas → Database Access
# 2. Click "Add New Database User"
# 3. Choose "Certificate" authentication method
# 4. Download the certificate file
# 5. Replace this file with the downloaded certificate
#
# File should be in PEM format containing both certificate and private key
`;
        
        await fs.writeFile(this.mongoConfig.tlsCertificateKeyFile, placeholderContent);
        console.log(`📝 Created certificate placeholder at: ${this.mongoConfig.tlsCertificateKeyFile}`);
    }

    async initializeDatabases() {
        console.log('🏗️  Initializing databases and collections...');
        
        for (const [dbName, dbConfig] of Object.entries(this.mongoConfig.databases)) {
            try {
                const db = this.mongoClient.db(dbConfig);
                
                // Create collections based on database type
                if (dbName === 'main') {
                    await this.createMainCollections(db);
                } else if (dbName === 'beta') {
                    await this.createBetaCollections(db);
                } else if (dbName === 'analytics') {
                    await this.createAnalyticsCollections(db);
                } else if (dbName === 'nft') {
                    await this.createNFTCollections(db);
                }
                
                console.log(`✅ Database '${dbConfig}' initialized`);
            } catch (error) {
                console.log(`⚠️  Failed to initialize '${dbConfig}':`, error.message);
            }
        }
    }

    async createMainCollections(db) {
        const collections = ['users', 'loans', 'respect_points', 'transactions', 'wallets'];
        for (const collection of collections) {
            await db.createCollection(collection, { capped: false });
        }
    }

    async createBetaCollections(db) {
        const collections = ['beta_users', 'contracts', 'feedback', 'sessions', 'device_fingerprints'];
        for (const collection of collections) {
            await db.createCollection(collection, { capped: false });
        }
    }

    async createAnalyticsCollections(db) {
        const collections = ['events', 'metrics', 'performance', 'errors'];
        for (const collection of collections) {
            await db.createCollection(collection, { capped: true, size: 100000000, max: 1000000 });
        }
    }

    async createNFTCollections(db) {
        const collections = ['nft_metadata', 'ownership_records', 'contract_signatures', 'verification_logs'];
        for (const collection of collections) {
            await db.createCollection(collection, { capped: false });
        }
    }

    async startAllServices() {
        console.log('🔧 Starting ecosystem services...\n');

        for (const [serviceName, config] of Object.entries(this.serviceConfig)) {
            try {
                await this.startService(serviceName, config);
                
                // Wait a bit between service starts
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Failed to start ${serviceName}:`, error.message);
                
                if (config.critical) {
                    console.error('💥 Critical service failed, shutting down ecosystem');
                    await this.shutdown();
                    process.exit(1);
                }
            }
        }
    }

    async startService(serviceName, config) {
        console.log(`🚀 Starting ${serviceName}...`);
        
        // Check if script exists
        try {
            await fs.access(config.script);
        } catch (error) {
            throw new Error(`Script not found: ${config.script}`);
        }

        // Set up environment variables
        const env = {
            ...process.env,
            ...config.env,
            MONGODB_URI: this.mongoConfig.uri,
            MONGODB_CERT_PATH: this.mongoConfig.tlsCertificateKeyFile,
            SERVICE_NAME: serviceName
        };

        // Spawn process
        const child = spawn('node', [config.script], {
            env,
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: process.cwd()
        });

        // Store service reference
        this.services.set(serviceName, {
            process: child,
            config,
            startTime: Date.now(),
            restarts: 0,
            status: 'starting'
        });

        // Handle process output
        child.stdout.on('data', (data) => {
            console.log(`[${serviceName}] ${data.toString().trim()}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`[${serviceName}] ERROR: ${data.toString().trim()}`);
        });

        // Handle process exit
        child.on('exit', (code, signal) => {
            const service = this.services.get(serviceName);
            
            if (!this.isShuttingDown && service) {
                console.log(`⚠️  Service ${serviceName} exited with code ${code}`);
                
                if (service.config.critical && service.restarts < 3) {
                    console.log(`🔄 Restarting critical service ${serviceName}...`);
                    service.restarts++;
                    setTimeout(() => this.startService(serviceName, config), 5000);
                } else {
                    service.status = 'stopped';
                    this.services.delete(serviceName);
                }
            }
        });

        // Wait for service to be ready
        await this.waitForService(serviceName, config);
        
        const service = this.services.get(serviceName);
        if (service) {
            service.status = 'running';
        }
        
        console.log(`✅ ${serviceName} started successfully`);
        if (config.port) {
            console.log(`🌐 ${config.description} available on port ${config.port}`);
        }
    }

    async waitForService(serviceName, config) {
        if (!config.port) return; // No port to check

        const maxAttempts = 30;
        const delay = 1000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const { exec } = require('child_process');
                await new Promise((resolve, reject) => {
                    exec(`curl -s http://localhost:${config.port}/health || echo "failed"`, (error, stdout) => {
                        if (stdout.includes('failed')) {
                            reject(new Error('Service not ready'));
                        } else {
                            resolve();
                        }
                    });
                });
                return; // Service is ready
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error(`Service ${serviceName} failed to start within ${maxAttempts} seconds`);
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    startHealthMonitoring() {
        setInterval(async () => {
            if (this.isShuttingDown) return;

            console.log(`\n🔍 Health Check - ${new Date().toISOString()}`);
            console.log('=======================================');

            // Check MongoDB connection
            if (this.mongoClient) {
                try {
                    await this.mongoClient.db('admin').admin().ping();
                    console.log('✅ MongoDB: Connected');
                } catch (error) {
                    console.log('❌ MongoDB: Disconnected');
                }
            } else {
                console.log('⚠️  MongoDB: Not configured');
            }

            // Check services
            for (const [serviceName, service] of this.services.entries()) {
                const uptime = Math.floor((Date.now() - service.startTime) / 1000);
                const status = service.status === 'running' ? '✅' : '❌';
                console.log(`${status} ${serviceName}: ${service.status} (${uptime}s, restarts: ${service.restarts})`);
            }

            console.log('');
        }, 30000); // Check every 30 seconds
    }

    setupSignalHandlers() {
        process.on('SIGINT', () => {
            console.log('\n🛑 Received SIGINT, shutting down ecosystem...');
            this.shutdown();
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Received SIGTERM, shutting down ecosystem...');
            this.shutdown();
        });

        process.on('uncaughtException', (error) => {
            console.error('💥 Uncaught Exception:', error);
            this.shutdown();
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
            this.shutdown();
        });
    }

    async shutdown() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;

        console.log('\n🛑 Shutting down TiltCheck Ecosystem...');

        // Stop all services
        for (const [serviceName, service] of this.services.entries()) {
            console.log(`⏹️  Stopping ${serviceName}...`);
            try {
                service.process.kill('SIGTERM');
                
                // Wait for graceful shutdown
                await new Promise(resolve => {
                    const timeout = setTimeout(() => {
                        service.process.kill('SIGKILL');
                        resolve();
                    }, 10000);
                    
                    service.process.on('exit', () => {
                        clearTimeout(timeout);
                        resolve();
                    });
                });
                
                console.log(`✅ ${serviceName} stopped`);
            } catch (error) {
                console.error(`❌ Error stopping ${serviceName}:`, error.message);
            }
        }

        // Close MongoDB connection
        if (this.mongoClient) {
            try {
                await this.mongoClient.close();
                console.log('✅ MongoDB connection closed');
            } catch (error) {
                console.error('❌ Error closing MongoDB:', error.message);
            }
        }

        console.log('✅ Ecosystem shutdown complete');
        process.exit(0);
    }

    // Test MongoDB connectivity
    async testMongoDB() {
        if (!this.mongoClient) {
            console.log('❌ MongoDB not connected');
            return false;
        }

        try {
            console.log('🧪 Testing MongoDB operations...');
            
            // Test basic operations
            const testDB = this.mongoClient.db(this.mongoConfig.databases.main);
            const testCollection = testDB.collection('test');
            
            // Insert test document
            const testDoc = { 
                timestamp: new Date(), 
                message: 'TiltCheck Ecosystem Test',
                ecosystem_version: '2.1.0'
            };
            
            const insertResult = await testCollection.insertOne(testDoc);
            console.log('✅ MongoDB write test passed');
            
            // Read test document
            const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
            console.log('✅ MongoDB read test passed');
            
            // Count documents
            const docCount = await testCollection.countDocuments({});
            console.log(`✅ MongoDB count test passed: ${docCount} documents`);
            
            // Clean up test document
            await testCollection.deleteOne({ _id: insertResult.insertedId });
            console.log('✅ MongoDB cleanup test passed');
            
            return true;
            
        } catch (error) {
            console.error('❌ MongoDB test failed:', error.message);
            return false;
        }
    }
}

// CLI interface
if (require.main === module) {
    const ecosystem = new EcosystemAutostart();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'start';
    
    switch (command) {
        case 'start':
            ecosystem.initialize();
            break;
            
        case 'test-mongo':
            ecosystem.initializeMongoDB()
                .then(() => ecosystem.testMongoDB())
                .then(() => process.exit(0))
                .catch(error => {
                    console.error('MongoDB test failed:', error);
                    process.exit(1);
                });
            break;
            
        case 'help':
            console.log(`
TiltCheck Ecosystem Autostart Manager

Commands:
  start        Start the complete ecosystem (default)
  test-mongo   Test MongoDB connectivity
  help         Show this help

Environment Variables:
  MONGODB_CERT_PATH    Path to MongoDB X.509 certificate
  NODE_ENV            Set to 'production' for production mode

Examples:
  node ecosystem-autostart.js
  node ecosystem-autostart.js start
  node ecosystem-autostart.js test-mongo
  MONGODB_CERT_PATH=/path/to/cert.pem node ecosystem-autostart.js
            `);
            break;
            
        default:
            console.error(`Unknown command: ${command}`);
            console.log('Use "node ecosystem-autostart.js help" for usage information');
            process.exit(1);
    }
}

module.exports = EcosystemAutostart;
