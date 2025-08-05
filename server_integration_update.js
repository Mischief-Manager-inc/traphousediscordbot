// Additional routes for consolidated TrapHouse Discord Bot features
// Add these routes to unified-ecosystem-server.js

// Beta installation and documentation routes
this.app.get('/beta/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'beta', 'docs', 'index.html'));
});

this.app.get('/beta/downloads', (req, res) => {
    res.sendFile(path.join(__dirname, 'beta', 'downloads', 'index.html'));
});

this.app.get('/beta/installer', (req, res) => {
    res.sendFile(path.join(__dirname, 'beta', 'installer', 'index.html'));
});

// Docker learning system routes
this.app.get('/docker', (req, res) => {
    res.json({
        title: "Docker Learning Systems",
        description: "Educational Docker containers for learning container orchestration",
        demos: {
            bindmount: {
                name: "Bind Mount Demo",
                description: "Learn Docker bind mounts with practical examples",
                port: 3001,
                path: "/docker/bindmount"
            },
            multiContainer: {
                name: "Multi-Container Demo",
                description: "Learn multi-service Docker composition",
                port: 3000,
                path: "/docker/multi-container"
            }
        },
        instructions: "Use docker compose up -d in the respective directories",
        footer: this.getEcosystemFooter()
    });
});

this.app.get('/docker/bindmount', (req, res) => {
    res.json({
        title: "Bind Mount Application Demo",
        description: "Educational Docker bind mount demonstration",
        status: "🐳 Docker Learning System",
        setup_instructions: [
            "Navigate to bindmount-apps directory",
            "Run: docker compose up -d",
            "Access: http://localhost:3001"
        ],
        learning_objectives: [
            "Understanding Docker bind mounts",
            "File system synchronization",
            "Development workflow optimization"
        ],
        code_location: "bindmount-apps/",
        footer: this.getEcosystemFooter()
    });
});

this.app.get('/docker/multi-container', (req, res) => {
    res.json({
        title: "Multi-Container Application Demo",
        description: "Educational multi-service Docker demonstration",
        status: "🐳 Docker Learning System",
        setup_instructions: [
            "Navigate to multi-container-app directory",
            "Run: docker compose up -d",
            "Access: http://localhost:3000"
        ],
        learning_objectives: [
            "Multi-service architecture",
            "Container orchestration",
            "Service communication",
            "Production deployment patterns"
        ],
        code_location: "multi-container-app/",
        footer: this.getEcosystemFooter()
    });
});

// Beta assets serving
this.app.use('/beta-assets', express.static(path.join(__dirname, 'dashboard', 'beta-assets')));

// Environment configuration endpoint
this.app.get('/config/environments', (req, res) => {
    res.json({
        title: "Environment Configurations",
        description: "Available environment configuration templates",
        configurations: {
            beta: {
                file: ".env.beta",
                description: "Beta testing environment configuration",
                features: ["Beta feature flags", "Testing database", "Debug logging"]
            },
            payments: {
                file: ".env.payments",
                description: "Payment system configuration",
                features: ["Crypto payment setup", "Wallet configurations", "API keys"]
            },
            ecosystem: {
                file: ".env.ecosystem",
                description: "Full ecosystem configuration",
                features: ["All services enabled", "Production settings", "Full feature set"]
            }
        },
        usage: "Copy the desired .env.* file to .env for your configuration",
        footer: this.getEcosystemFooter()
    });
});
