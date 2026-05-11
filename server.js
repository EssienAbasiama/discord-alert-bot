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
            console.log("❌ ALERT CHANNEL NOT FOUND");
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
        console.log(err);
    }
});

// =====================
// MESSAGE DETECTION (FULL DEBUG VERSION)
// =====================
const keywords = ["crypto", "refund", "payment", "withdraw"];

client.on("messageCreate", async message => {

    // STEP 1: CONFIRM EVENT FIRED
    console.log("==================================");
    console.log("📩 MESSAGE EVENT FIRED");

    // STEP 2: RAW MESSAGE CHECK (CRITICAL DEBUG)
    console.log("RAW MESSAGE OBJECT:", {
        content: message.content,
        author: message.author?.tag,
        bot: message.author?.bot,
        channel: message.channel?.name
    });

    // STEP 3: BOT FILTER
    if (message.author.bot) {
        console.log("⛔ Ignored bot message");
        return;
    }

    // STEP 4: CONTENT CHECK
    const content = (message.content || "").toLowerCase();
    console.log("🔍 Normalized content:", content);

    if (!content) {
        console.log("⚠️ Empty message content (INTENT ISSUE POSSIBLE)");
        return;
    }

    // STEP 5: KEYWORD MATCHING DEBUG
    let detected = null;

    for (const keyword of keywords) {
        const match = content.includes(keyword);
        console.log(`➡️ Checking "${keyword}" => ${match}`);

        if (match) {
            detected = keyword;
            break;
        }
    }

    if (!detected) {
        console.log("❌ No keyword matched");
        return;
    }

    console.log(`⚠️ KEYWORD DETECTED: ${detected}`);

    // STEP 6: SEND ALERT
    try {
        const channel = await client.channels.fetch(ALERT_CHANNEL_ID);

        console.log("📤 Sending alert to channel...");

        await channel.send(
            `🚨 Keyword detected: ${detected}
👤 User: ${message.author.username}
💬 Message: ${message.content}
📍 Channel: ${message.channel.name}`
        );

        console.log("✅ ALERT SENT SUCCESSFULLY");
    } catch (err) {
        console.log("❌ FAILED TO SEND ALERT:");
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
    console.log("❌ BOT_TOKEN MISSING");
}

client.login(process.env.BOT_TOKEN)
    .then(() => console.log("✅ LOGIN SUCCESSFUL"))
    .catch(err => {
        console.log("❌ LOGIN FAILED:");
        console.log(err);
    });