require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

const ALERT_CHANNEL_ID = "1502787696140222507";

// =====================
// STARTUP DEBUG
// =====================
console.log("==================================");
console.log("🚀 BOT STARTING...");
console.log("🧠 Node Env:", process.env.NODE_ENV || "not set");
console.log("🔑 BOT TOKEN EXISTS:", !!process.env.BOT_TOKEN);
console.log("📡 ALERT CHANNEL ID:", ALERT_CHANNEL_ID);
console.log("==================================");

// =====================
// EXPRESS SERVER
// =====================
app.get("/", (req, res) => {
    console.log("🌐 Health check request received");
    res.send("Discord bot is running");
});

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
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
// READY EVENT
// =====================
client.once("ready", async () => {
    console.log("==================================");
    console.log(`🤖 BOT READY: ${client.user.tag}`);
    console.log(`🆔 ID: ${client.user.id}`);
    console.log(`📊 Servers: ${client.guilds.cache.size}`);
    console.log("==================================");

    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        if (!channel) {
            console.log("❌ ALERT CHANNEL NOT FOUND (fetch returned null)");
            return;
        }

        console.log("✅ ALERT CHANNEL FOUND:", channel.name);

        await channel.send("🤖 Bot is now online and monitoring events");
        console.log("📤 Startup message sent");
    } catch (err) {
        console.log("❌ ERROR FETCHING ALERT CHANNEL:");
        console.log(err);
    }
});

// =====================
// MEMBER JOIN
// =====================
client.on("guildMemberAdd", async member => {
    console.log("----------------------------------");
    console.log("👤 NEW MEMBER EVENT");
    console.log(`User: ${member.user.tag}`);
    console.log(`Guild: ${member.guild.name}`);
    console.log(`Guild ID: ${member.guild.id}`);

    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        console.log("📤 Sending join alert...");

        await channel.send(`🚨 New member joined: ${member.user.username}`);

        console.log("✅ Join alert sent");
    } catch (err) {
        console.log("❌ JOIN ALERT FAILED:");
        console.log(err);
    }
});

// =====================
// MESSAGE DETECTION
// =====================
const keywords = ["crypto", "refund", "payment", "withdraw"];

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    console.log("----------------------------------");
    console.log("💬 MESSAGE EVENT");
    console.log(`User: ${message.author.tag}`);
    console.log(`Channel: ${message.channel.name}`);
    console.log(`Content: ${message.content}`);

    const content = message.content.toLowerCase();

    const detected = keywords.find(k => content.includes(k));

    if (!detected) return;

    console.log(`⚠️ KEYWORD MATCHED: ${detected}`);

    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        await channel.send(
            `🚨 Keyword detected: ${detected}
👤 User: ${message.author.username}
💬 Message: ${message.content}
📍 Channel: ${message.channel.name}`
        );

        console.log("✅ Keyword alert sent");
    } catch (err) {
        console.log("❌ KEYWORD ALERT FAILED:");
        console.log(err);
    }
});

// =====================
// GLOBAL ERROR HANDLING
// =====================
client.on("error", err => {
    console.log("❌ DISCORD CLIENT ERROR:");
    console.log(err);
});

client.on("warn", info => {
    console.log("⚠️ DISCORD WARNING:", info);
});

process.on("unhandledRejection", err => {
    console.log("❌ UNHANDLED PROMISE ERROR:");
    console.log(err);
});

process.on("uncaughtException", err => {
    console.log("❌ UNCAUGHT EXCEPTION:");
    console.log(err);
});

// =====================
// LOGIN
// =====================
console.log("🔐 Attempting Discord login...");

if (!process.env.BOT_TOKEN) {
    console.log("❌ BOT_TOKEN is missing in environment variables!");
}

client.login(process.env.BOT_TOKEN)
    .then(() => {
        console.log("✅ LOGIN SUCCESSFUL");
    })
    .catch(err => {
        console.log("❌ LOGIN FAILED:");
        console.log(err);
    });