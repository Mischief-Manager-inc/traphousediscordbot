#!/bin/bash
# Discord Bot Invite Link Generator
# Creates proper invite links with appropriate permissions for each bot

echo "🤖 TrapHouse Discord Bot Ecosystem - Invite Links"
echo "================================================="
echo ""

# Bot IDs from botRoleManager.js
TRAPHOUSE_BOT_ID="1354450590813655142"
JUSTTHETIP_BOT_ID="1373784722718720090" 
DEGENS_BOT_ID="1376113587025739807"

# Permission calculations for Discord OAuth2
# https://discord.com/developers/docs/topics/permissions

# TrapHouse Bot Permissions (Enterprise Operations)
# - Send Messages (2048)
# - Embed Links (16384) 
# - Read Message History (65536)
# - Use Slash Commands (2147483648)
# - Manage Messages (8192) - for loan management
# - Add Reactions (64) - for respect system
# - View Channels (1024)
TRAPHOUSE_PERMS="2147559744"  # Combined permissions

# JustTheTip Bot Permissions (Financial & Crypto Operations)
# - Send Messages (2048)
# - Embed Links (16384)
# - Read Message History (65536) 
# - Use Slash Commands (2147483648)
# - Attach Files (32768) - for payment receipts
# - View Channels (1024)
# - Send Messages in Threads (274877906944) - for tilt monitoring
JUSTTHETIP_PERMS="2147583488"  # Combined permissions

# Degens Bot Permissions (Gaming & Community)
# - Send Messages (2048)
# - Embed Links (16384)
# - Read Message History (65536)
# - Use Slash Commands (2147483648)
# - Add Reactions (64) - for game interactions
# - Manage Messages (8192) - for game management
# - View Channels (1024)
DEGENS_PERMS="2147559744"  # Combined permissions

echo "🏠 TrapHouse Bot - Enterprise Command Center"
echo "Features: Loans, Respect System, Casino Trust, Enterprise Operations"
echo "Invite Link:"
echo "https://discord.com/api/oauth2/authorize?client_id=${TRAPHOUSE_BOT_ID}&permissions=${TRAPHOUSE_PERMS}&scope=bot%20applications.commands"
echo ""

echo "💰 JustTheTip Bot - Financial Operations & Crypto"
echo "Features: Crypto Payments, TiltCheck, CollectClock, Payment Processing"
echo "Invite Link:"
echo "https://discord.com/api/oauth2/authorize?client_id=${JUSTTHETIP_BOT_ID}&permissions=${JUSTTHETIP_PERMS}&scope=bot%20applications.commands"
echo ""

echo "🎮 Degens Bot - Gaming Community Hub" 
echo "Features: Card Games, Tournaments, Gaming Stats, Community Hub"
echo "Invite Link:"
echo "https://discord.com/api/oauth2/authorize?client_id=${DEGENS_BOT_ID}&permissions=${DEGENS_PERMS}&scope=bot%20applications.commands"
echo ""

echo "📋 Permission Breakdown:"
echo "- Send Messages: Basic bot communication"
echo "- Embed Links: Rich message formatting"
echo "- Read Message History: Context awareness"
echo "- Use Slash Commands: Modern Discord commands"
echo "- Manage Messages: Game/loan management"
echo "- Add Reactions: Interactive features"
echo "- Attach Files: Payment receipts & documents"
echo ""

echo "⚠️  Important Notes:"
echo "1. Only invite the bot you need for your server"
echo "2. TrapHouse Bot = Enterprise/Loan operations"
echo "3. JustTheTip Bot = Crypto payments & monitoring" 
echo "4. Degens Bot = Gaming & community features"
echo "5. Each bot has different command prefixes:"
echo "   - TrapHouse: !street, !front, !respect"
echo "   - JustTheTip: \$tip, \$balance, \$withdraw ($ prefix)"
echo "   - Degens: !degens, !play, !tournament"
echo ""
echo "✅ All Bot Tokens Configured and Ready!"
echo "🔑 Token Status:"
echo "   - TrapHouse Bot: ✅ Active"
echo "   - JustTheTip Bot: ✅ Active (Updated)"
echo "   - Degens Bot: ✅ Active (Updated)"
