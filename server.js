require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

// YOUR ALERT CHANNEL ID (from Discord)
const ALERT_CHANNEL_ID = "1502787696140222507";

// Dummy route for Render
app.get("/", (req, res) => {
    res.send("Discord bot is running");
});

// Start HTTP server (needed for Render)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Discord bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const keywords = ["crypto", "refund", "payment", "withdraw"];

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// NEW MEMBER JOIN
client.on("guildMemberAdd", member => {
    const alertChannel = client.channels.cache.get(ALERT_CHANNEL_ID);

    if (alertChannel) {
        alertChannel.send(
            `🚨 New member joined: ${member.user.username}`
        );
    }
});

// KEYWORD DETECTION
client.on("messageCreate", message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    const detected = keywords.find(keyword =>
        content.includes(keyword)
    );

    if (detected) {
        const alertChannel = client.channels.cache.get(ALERT_CHANNEL_ID);

        if (alertChannel) {
            alertChannel.send(
                `🚨 Keyword detected: ${detected}
User: ${message.author.username}
Message: ${message.content}
Channel: ${message.channel.name}`
            );
        }
    }
});

client.login(process.env.BOT_TOKEN);