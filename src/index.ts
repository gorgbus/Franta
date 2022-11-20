import { Client } from "eris";
import discordEvent from "./handlers/discordEvent";
import { config } from "dotenv";
import { EClient } from "./types";
import managerEvent from "./handlers/managerEvent";
import { Connectors } from "shoukaku";
import { Kazagumo, Plugins } from "kazagumo";
config();

const client = new Client(process.env.TOKEN!, {
    intents: 33427,
}) as EClient;

client.manager = new Kazagumo({
    defaultSearchEngine: "youtube",
    send: (guildId, payload) => {
        const guild = client.guilds.get(guildId);

        if (guild) guild.shard.sendWS(payload.op, payload.d);        
    },
    plugins: [new Plugins.PlayerMoved(client)]
}, new Connectors.Eris(client), [{
    url: `${process.env.LAVA_IP}:${process.env.LAVA_PORT}`,
    name: process.env.LAVA_IP!,
    auth: process.env.LAVALINK!
}], {
    moveOnDisconnect: true,
});

discordEvent(client);
managerEvent(client.manager, client);

client.connect();

