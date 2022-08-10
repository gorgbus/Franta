import { EClient } from "../../types"
import { updateCommands, updateGuildCommands } from "../../util";
import { config } from "dotenv";
config();

export const event = {
    once: true,
    name: 'ready'
}

export const execute = (client: EClient) => {
    console.log(`${client.user.username} has logged in!`);
    client.manager.init(client.user.id);

    if (process.env.PROD === 'dev')
        updateGuildCommands(client);
    else
        updateCommands(client);
}