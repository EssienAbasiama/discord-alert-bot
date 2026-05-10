require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

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

// New user joins
client.on("guildMemberAdd", member => {
    const alertChannel = member.guild.channels.cache.find(
        ch => ch.name === "alerts"
    );

    if (alertChannel) {
        alertChannel.send(
            `🚨 New member joined: ${member.user.username}`
        );
    }
});

// Keyword detection
client.on("messageCreate", message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    const detected = keywords.find(keyword =>
        content.includes(keyword)
    );

    if (detected) {
        const alertChannel = message.guild.channels.cache.find(
            ch => ch.name === "alerts"
        );

        if (alertChannel) {
            alertChannel.send(`
🚨 Keyword detected: ${detected}
User: ${message.author.username}
Channel: ${message.channel.name}
Message: ${message.content}
      `);
        }
    }
});

client.login(process.env.BOT_TOKEN);