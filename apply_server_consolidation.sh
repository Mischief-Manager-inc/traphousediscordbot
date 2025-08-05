#!/bin/bash

echo "Applying Server Consolidation Updates..."

# Find the line number where we should insert the new routes
# Look for the existing beta routes section
LINE_NUM=$(grep -n "this.app.get('/beta/admin'" unified-ecosystem-server.js | head -1 | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
    echo "Could not find beta routes section. Adding to end of setupUnifiedRouting method..."
    # Find the end of setupUnifiedRouting method
    LINE_NUM=$(grep -n "setupAPIRoutes" unified-ecosystem-server.js | head -1 | cut -d: -f1)
    LINE_NUM=$((LINE_NUM - 2))
fi

echo "Inserting new routes after line $LINE_NUM..."

# Create a temporary file with the new routes
cat > temp_routes.js << 'ROUTES_END'

        // ===== CONSOLIDATED TRAPHOUSE FEATURES =====
        
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

ROUTES_END

# Insert the new routes into the server file
head -n $LINE_NUM unified-ecosystem-server.js > temp_server.js
cat temp_routes.js >> temp_server.js
tail -n +$((LINE_NUM + 1)) unified-ecosystem-server.js >> temp_server.js

# Replace the original file
mv temp_server.js unified-ecosystem-server.js
rm temp_routes.js

echo "Server consolidation complete!"

# Add beta assets static serving to setupStaticFiles method
echo "Adding beta assets static serving..."
sed -i '' '/this.app.use.*webapp.*\.next/a\
        \
        // Beta assets from consolidated TrapHouse features\
        this.app.use('\''/beta-assets'\'', express.static(path.join(__dirname, '\''dashboard'\'', '\''beta-assets'\'')));
' unified-ecosystem-server.js

echo "All server consolidation updates applied successfully!"
