require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy route for Render
app.get("/", (req, res) => {
    res.send("Discord bot is running");
});

// Start HTTP server
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

client.on("guildMemberAdd", member => {
    const alertChannel = member.guild.channels.cache.find(
        ch => ch.name === "alerts"
    );

    if (alertChannel) {
        alertChannel.send(`New member joined: ${member.user.username}`);
    }
});

client.on("messageCreate", message => {
    if (message.author.bot) return;

    const detected = keywords.find(keyword =>
        message.content.toLowerCase().includes(keyword)
    );

    if (detected) {
        const alertChannel = message.guild.channels.cache.find(
            ch => ch.name === "alerts"
        );

        if (alertChannel) {
            alertChannel.send(`
Keyword detected: ${detected}
User: ${message.author.username}
Message: ${message.content}
      `);
        }
    }
});

client.login(process.env.BOT_TOKEN);