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
                    commands.push(command.data);
                    console.log(`✅ Loaded: ${command.data.name}`);
                } else {
                    console.log(`⚠️  Skipped ${file}: No valid slash command data`);
                }
            } catch (error) {
                console.log(`❌ Error loading ${file}:`, error.message);
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
        return;
    }
    
    if (!token) {
        console.error('❌ Missing TOKEN in environment variables');
        return;
    }
    
    console.log(`🎯 Deploying to: ${guildId ? `Guild ${guildId}` : 'Global'}`);
    console.log(`🤖 Client ID: ${clientId.substring(0, 10)}...`);
    console.log(`📦 Commands to deploy: ${commands.length}\n`);
    
    // Create REST instance
    const rest = new REST().setToken(token);
    
    try {
        console.log('🔄 Deploying slash commands...');
        
        let data;
        if (guildId) {
            // Deploy to specific guild
            data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            );
            console.log(`✅ Successfully deployed ${data.length} guild commands!`);
        } else {
            // Deploy globally
            data = await rest.put(
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

// Run deployment
deployCommands();
