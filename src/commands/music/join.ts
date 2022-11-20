import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";
import { checkVoice } from "../../util";

export default {
    command: {
        name: "join",
        nameLocalizations: {
            cs: "připojit"
        },
        description: "joins the room",
        descriptionLocalizations: {
            cs: "připojí bota do roomky"
        },
        type: 1
    } as ApplicationCommandStructure,
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const player = client.manager.players.get(interaction.guildID!);

        if (player) return interaction.createMessage({ content: `<@${client.user.id}> už je připojený v <#${player.voiceId}>`, flags: 64 })

        if (!checkVoice(interaction, player!, true)) return;

        const newPlayer = await client.manager.createPlayer({
            guildId: interaction.guildID!,
            voiceId: interaction.member?.voiceState.channelID!,
            textId: interaction.channel.id,
        });

        interaction.createMessage(`připojeno do <#${interaction.member?.voiceState.channelID}>`)
    }
}