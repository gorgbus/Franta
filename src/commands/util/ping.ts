import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";

export const command: ApplicationCommandStructure = {
    name: 'ping',
    description: 'ukáže ping bota',
    type: 1
}

export const execute = (client: EClient, interaction: CommandInteraction) => {
    const ping = client.guilds.get(interaction.guildID!)?.shard.latency;

    interaction.createMessage(`**Shard**: ${ping}ms`);
}