const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();

const commands = [];

// Define all working slash commands to register
const workingCommands = [
    'beta-trust.js',
    'casino-profile.js', 
    'casino-ranking.js',
    'casino-transparency.js',
    'casino-verify.js',
    'enhanced-loan.js',
    'enhancedTiltCheck.js',
    'general.js',
    'help_fixed.js',
    'nft-trust.js',
    'payment.js',
    'trust-score.js'
];

// Load all working commands
const commandsPath = path.join(__dirname, 'commands');
for (const file of workingCommands) {
    const filePath = path.join(commandsPath, file);
    if (fs.existsSync(filePath)) {
        try {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                console.log(`✅ Loaded command: ${command.data.name}`);
            } else {
                console.log(`⚠️ Command ${file} is missing required properties.`);
            }
        } catch (error) {
            console.log(`❌ Error loading ${file}:`, error.message);
        }
    } else {
        console.log(`❌ Command file not found: ${file}`);
    }
}



// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

// Deploy commands
(async () => {
    try {
        console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

        // Use environment variable CLIENT_ID
        const CLIENT_ID = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;
        
        console.log(`🎯 Using TrapHouse Bot CLIENT_ID: ${CLIENT_ID}`);
        
        if (!CLIENT_ID) {
            throw new Error('CLIENT_ID not found');
        }

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
        
        // Log registered commands
        console.log('\n📋 Registered Commands:');
        data.forEach(cmd => {
            console.log(`   • /${cmd.name} - ${cmd.description}`);
        });
        
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
        
        if (error.code === 50001) {
            console.log('⚠️ Missing Access: Bot may not have proper permissions');
        } else if (error.code === 10002) {
            console.log('⚠️ Unknown Application: Check your CLIENT_ID');
        }
    }
})();
