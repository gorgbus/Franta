import { Guild } from "eris"
import { EClient } from "../../types"
import { updateGuildCommands } from "../../util";

export const event = {
    once: false,
    name: 'guildCreate'
}

export const execute = (guild: Guild, client: EClient) => {
    updateGuildCommands(client, guild.id);
}