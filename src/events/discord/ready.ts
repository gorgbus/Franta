import { EClient } from "../../types"
import { updateCommands } from "../../util";

export const event = {
    once: true,
    name: 'ready'
}

export const execute = (client: EClient) => {
    console.log(`${client.user.username} has logged in!`);
    client.manager.init(client.user.id);

    updateCommands(client);
}