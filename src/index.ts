import Eris from "eris";
import discordEvent from "./handlers/discordEvent";
import { Manager } from "erela.js";
import { config } from "dotenv";
import { EClient } from "./types";
import erelaEvent from "./handlers/erelaEvent";
config();

const client = new Eris.Client(process.env.TOKEN!, {
    intents: 33427,
}) as EClient;

client.manager = new Manager({
    nodes: [
        {
            host: process.env.LAVA_IP!,
            port: 6900,
            password: process.env.LAVALINK
        }
    ],
    send(id, paylod) {
        const guild = client.guilds.get(id);

        if (guild) guild.shard.sendWS(paylod.op, paylod.d);
    }
});

discordEvent(client);
erelaEvent(client.manager, client);

client.on('rawWS', (packet: any) => {
    client.manager.updateVoiceState(packet);
});

client.connect();

