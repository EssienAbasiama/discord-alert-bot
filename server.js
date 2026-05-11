require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

const ALERT_CHANNEL_ID = "1502787696140222507";

// =====================
// EXPRESS SERVER LOGS
// =====================
app.get("/", (req, res) => {
    console.log("🌐 Health check request received");
    res.send("Discord bot is running");
});

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log("📡 Render instance is active");
});

// =====================
// DISCORD CLIENT
// =====================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// =====================
// BOT READY EVENT
// =====================
client.once("ready", () => {
    console.log("==================================");
    console.log(`🤖 Bot logged in as: ${client.user.tag}`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
    console.log("📡 Listening for events...");
    console.log("==================================");

    const channel = client.channels.cache.get(ALERT_CHANNEL_ID);

    if (channel) {
        console.log("✅ Alert channel found and ready");
        channel.send("🤖 Bot is now online and monitoring events");
    } else {
        console.log("❌ ALERT CHANNEL NOT FOUND - check channel ID or permissions");
    }
});

// =====================
// NEW MEMBER JOIN LOGS
// =====================
client.on("guildMemberAdd", member => {
    console.log("----------------------------------");
    console.log("👤 New member joined detected");
    console.log(`Username: ${member.user.username}`);
    console.log(`User ID: ${member.user.id}`);
    console.log(`Server: ${member.guild.name}`);

    const alertChannel = client.channels.cache.get(ALERT_CHANNEL_ID);

    if (alertChannel) {
        console.log("📤 Sending join alert...");
        alertChannel.send(`🚨 New member joined: ${member.user.username}`);
        console.log("✅ Join alert sent successfully");
    } else {
        console.log("❌ Failed to find alert channel for join event");
    }
});

// =====================
// KEYWORD DETECTION LOGS
// =====================
const keywords = ["crypto", "refund", "payment", "withdraw"];

client.on("messageCreate", message => {
    if (message.author.bot) return;

    console.log("----------------------------------");
    console.log("💬 Message detected");
    console.log(`User: ${message.author.username}`);
    console.log(`Channel: ${message.channel.name}`);
    console.log(`Content: ${message.content}`);

    const content = message.content.toLowerCase();

    const detected = keywords.find(keyword =>
        content.includes(keyword)
    );

    if (detected) {
        console.log(`⚠️ Keyword detected: ${detected}`);

        const alertChannel = client.channels.cache.get(ALERT_CHANNEL_ID);

        if (alertChannel) {
            console.log("📤 Sending keyword alert...");
            alertChannel.send(
                `🚨 Keyword detected: ${detected}
👤 User: ${message.author.username}
💬 Message: ${message.content}
📍 Channel: ${message.channel.name}`
            );
            console.log("✅ Keyword alert sent successfully");
        } else {
            console.log("❌ Alert channel not found for keyword event");
        }
    }
});

// =====================
// ERROR HANDLING (VERY IMPORTANT)
// =====================
client.on("error", error => {
    console.log("❌ Discord client error:", error);
});

process.on("unhandledRejection", error => {
    console.log("❌ Unhandled promise error:", error);
});

// =====================
// LOGIN
// =====================
console.log("🔐 Attempting to log in to Discord...");
client.login(process.env.BOT_TOKEN)
    .then(() => {
        console.log("✅ Login request successful");
    })
    .catch(err => {
        console.log("❌ Login failed:", err);
    });