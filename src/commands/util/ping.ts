import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";

export default {
    command:  {
        name: "ping",
        description: "shows bot's latency",
        descriptionLocalizations: {
            cs: "ukáže ping bota"
        },
        type: 1
    } as ApplicationCommandStructure,
    execute: (client: EClient, interaction: CommandInteraction) => {
        const ping = client.guilds.get(interaction.guildID!)?.shard.latency;

        interaction.createMessage(`**Shard**: ${ping}ms`);
    }
}