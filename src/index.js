const { Client, Intents } = require("discord.js");
const { registerCommands, registerEvents } = require("./utils/registry");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const mongoose = require("mongoose");
const guildCfg = require("./db/schemas/GuildCfg");
require('dotenv').config()
//const WebSocket = require("ws");
//const server = new WebSocket.Server({ port: "1414" });

const fs = require("fs");

mongoose.connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

(async () => {
    client.commands = new Map();
    client.events = new Map();
    client.configs = new Map();
    client.lang = new Map();

    await registerCommands(client, "../commands");
    await registerEvents(client, "../events");
    await client.login(process.env.TOKEN);

    const locFiles = fs.readdirSync("./loc").filter((file) => file.endsWith(".json"));

    for (const file of locFiles) {
        const langFile = require(`../loc/${file}`);
        client.lang.set(file.replace(".json", ""), langFile);
    }

    setTimeout(async () => {
        const guilds = client.guilds.cache.values();
        for (const guild of guilds) {
            const guildId = guild.id;
            const config = await guildCfg.findOne({ guildId });
            if (config) {
                client.configs.set(guild.id, config);
            } else {
                try {
                    const guildConfig = await guildCfg.create({
                        guildId: guild.id,
                    });
                    client.configs.set(guild.id, guildConfig);
                } catch (err) {
                    console.log(err);
                }
            }
        }

        console.log("DB loaded")
    }, 5000);
})();

/*server.on("connection", (socket) => {
    socket.on("message", (message) => {
        const args = message.split(" ");
        switch (args[1]) {
            case "64prefix1488":
                const config = client.configs.get(args[2]);
                config.prefix = args[0];
                client.configs.set(args[2], config);
                break;
        }
    });
});*/
