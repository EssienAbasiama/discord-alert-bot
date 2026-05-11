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
// EXPRESS SERVER (Render keeps app alive)
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
// DISCORD DEBUG EVENTS
// =====================
client.on("debug", console.log);
client.on("warn", console.warn);
client.on("error", console.error);

// =====================
// READY EVENT
// =====================
client.once("ready", async () => {
    console.log("==================================");
    console.log("🔥 READY EVENT FIRED SUCCESSFULLY");
    console.log(`🤖 BOT READY: ${client.user.tag}`);
    console.log(`🆔 ID: ${client.user.id}`);
    console.log(`📊 Servers: ${client.guilds.cache.size}`);
    console.log("==================================");

    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        if (!channel) {
            console.log("❌ ALERT CHANNEL NOT FOUND");
            return;
        }

        console.log("✅ ALERT CHANNEL FOUND:", channel.name);

        await channel.send("🤖 Bot is now online and monitoring events");
        console.log("📤 Startup message sent");
    } catch (err) {
        console.log("❌ ERROR FETCHING ALERT CHANNEL:");
        console.error(err);
    }
});

// =====================
// MEMBER JOIN DEBUG
// =====================
client.on("guildMemberAdd", async member => {
    console.log("----------------------------------");
    console.log("👤 NEW MEMBER EVENT TRIGGERED");
    console.log(`User: ${member.user.tag}`);
    console.log(`Guild: ${member.guild.name}`);

    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        console.log("📤 Sending join alert...");

        await channel.send(`🚨 New member joined: ${member.user.username}`);

        console.log("✅ Join alert sent");
    } catch (err) {
        console.log("❌ JOIN ALERT FAILED:");
        console.error(err);
    }
});

// =====================
// MESSAGE DETECTION
// =====================
const keywords = ["crypto", "refund", "payment", "withdraw"];

client.on("messageCreate", async message => {
    console.log("==================================");
    console.log("📩 MESSAGE EVENT FIRED");

    console.log({
        content: message.content,
        author: message.author?.tag,
        bot: message.author?.bot,
        channel: message.channel?.name
    });

    // ignore bots
    if (message.author.bot) return;

    const content = (message.content || "").toLowerCase();

    if (!content) {
        console.log("⚠️ Empty message content");
        return;
    }

    let detected = null;

    for (const keyword of keywords) {
        if (content.includes(keyword)) {
            detected = keyword;
            break;
        }
    }

    if (!detected) return;

    console.log(`⚠️ KEYWORD DETECTED: ${detected}`);

    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        await channel.send(
            `🚨 Keyword detected: ${detected}
👤 User: ${message.author.username}
💬 Message: ${message.content}
📍 Channel: ${message.channel.name}`
        );

        console.log("✅ ALERT SENT SUCCESSFULLY");
    } catch (err) {
        console.log("❌ FAILED TO SEND ALERT:");
        console.error(err);
    }
});

// =====================
// GLOBAL ERROR HANDLING
// =====================
process.on("unhandledRejection", err => {
    console.log("❌ UNHANDLED PROMISE ERROR:");
    console.error(err);
});

process.on("uncaughtException", err => {
    console.log("❌ UNCAUGHT EXCEPTION:");
    console.error(err);
});

// =====================
// LOGIN
// =====================
console.log("🔐 Attempting Discord login...");

if (!process.env.BOT_TOKEN) {
    console.log("❌ BOT_TOKEN MISSING");
    process.exit(1);
}

client.login(process.env.BOT_TOKEN)
    .then(() => {
        console.log("✅ LOGIN PROMISE RESOLVED");
    })
    .catch(err => {
        console.log("❌ LOGIN FAILED:");
        console.error(err);
    });