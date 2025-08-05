const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const commands = [];

// Function to recursively read command files
function readCommands(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        
        if (fs.statSync(filePath).isDirectory()) {
            readCommands(filePath);
        } else if (file.endsWith('.js')) {
            try {
                console.log(`📁 Loading command: ${file}`);
                const command = require(filePath);
                
                if (command.data && command.data.toJSON) {
                    commands.push(command.data.toJSON());
                    console.log(`✅ Loaded: ${command.data.name}`);
                } else if (command.data && command.data.name) {
                    // Handle cases where data might not have toJSON()
                    commands.push(command.data);
                    console.log(`✅ Loaded: ${command.data.name}`);
                } else {
                    console.log(`⚠️  Skipped ${file}: No valid slash command data`);
                }
            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error.message);
            }
        }
    }
}

async function deployCommands() {
    console.log('🚀 Starting slash command deployment...\n');
    
    // Load all commands from the commands directory
    const commandsPath = path.join(__dirname, 'commands');
    readCommands(commandsPath);
    
    console.log(`\n📊 Found ${commands.length} valid slash commands\n`);
    
    // Validate environment variables
    const clientId = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.GUILD_ID || process.env.DISCORD_GUILD_ID;
    const token = process.env.TOKEN || process.env.DISCORD_BOT_TOKEN;
    
    if (!clientId) {
        console.error('❌ Missing CLIENT_ID in environment variables');
        process.exit(1);
    }
    
    if (!token) {
        console.error('❌ Missing TOKEN in environment variables');
        process.exit(1);
    }
    
    // Create REST instance
    const rest = new REST({ version: '10' }).setToken(token);
    
    try {
        if (guildId) {
            console.log(`🎯 Deploying ${commands.length} commands to guild ${guildId}...`);
            
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            );
            
            console.log(`✅ Successfully deployed ${data.length} guild commands!`);
        } else {
            console.log(`🌐 Deploying ${commands.length} commands globally...`);
            console.log('⚠️  Note: Global commands may take up to 1 hour to update!');
            
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands }
            );
            
            console.log(`✅ Successfully deployed ${data.length} global commands!`);
        }
        
        console.log('\n📋 Deployed Commands:');
        commands.forEach((cmd, index) => {
            console.log(`${index + 1}. /${cmd.name} - ${cmd.description}`);
        });
        
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
        
        if (error.code === 50001) {
            console.log('💡 Missing access - check bot permissions and guild ID');
        } else if (error.code === 10002) {
            console.log('💡 Invalid guild ID or bot not in guild');
        } else if (error.code === 50035) {
            console.log('💡 Invalid command data - check command definitions');
        }
    }
}

// Command line argument handling
const args = process.argv.slice(2);

// If no arguments provided, default to --guild
if (args.length === 0) {
    args.push('--guild');
}

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎯 Slash Command Deployment Tool

Usage: node deploy-commands.js [options]

Options:
  --help, -h     Show this help message
  --guild        Deploy to guild only (faster, uses GUILD_ID)
  --global       Deploy globally (slower, 1 hour cache)
  --list         List commands without deploying
  --dry-run      Show what would be deployed

Environment Variables Required:
  CLIENT_ID or DISCORD_CLIENT_ID    - Discord application client ID
  TOKEN or DISCORD_BOT_TOKEN        - Discord bot token
  GUILD_ID or DISCORD_GUILD_ID      - Guild ID (optional, for guild-specific deployment)

Examples:
  node deploy-commands.js --guild    # Deploy to specific guild
  node deploy-commands.js --global   # Deploy globally
  node deploy-commands.js --list     # Just list commands
    `);
    process.exit(0);
}

if (args.includes('--list')) {
    console.log('📋 Listing available commands...\n');
    const commandsPath = path.join(__dirname, 'commands');
    readCommands(commandsPath);
    
    console.log(`\n📊 Total: ${commands.length} slash commands`);
    commands.forEach((cmd, index) => {
        console.log(`${index + 1}. /${cmd.name} - ${cmd.description}`);
    });
    process.exit(0);
}

if (args.includes('--dry-run')) {
    console.log('🧪 Dry run - showing what would be deployed...\n');
    const commandsPath = path.join(__dirname, 'commands');
    readCommands(commandsPath);
    
    console.log(`\n📊 Would deploy ${commands.length} commands:`);
    commands.forEach((cmd, index) => {
        console.log(`${index + 1}. /${cmd.name} - ${cmd.description}`);
        if (cmd.options && cmd.options.length > 0) {
            cmd.options.forEach(option => {
                console.log(`    └─ ${option.name} (${option.type}) - ${option.description}`);
            });
        }
    });
    
    const clientId = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.GUILD_ID || process.env.DISCORD_GUILD_ID;
    
    console.log(`\n🎯 Target: ${guildId ? `Guild ${guildId}` : 'Global'}`);
    console.log(`🤖 Client ID: ${clientId ? clientId.substring(0, 10) + '...' : 'NOT SET'}`);
    process.exit(0);
}

// Force global deployment
if (args.includes('--global')) {
    process.env.GUILD_ID = '';
}

// Deploy commands
deployCommands();
