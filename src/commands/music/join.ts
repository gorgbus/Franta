import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";
import { checkVoice } from "../../util";

export const command: ApplicationCommandStructure = {
    name: 'join',
    description: 'připojí bota do roomky',
    type: 1
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const player = client.manager.players.get(interaction.guildID!);

    if (player) return interaction.createMessage({ content: `<@${client.user.id}> už je připojený v <#${player.voiceChannel}>`, flags: 64 })

    if (!checkVoice(interaction, player!, true)) return;

    client.manager.create({
        guild: interaction.guildID!,
        voiceChannel: interaction.member?.voiceState.channelID!,
        textChannel: interaction.channel.id,
    }).connect();

    interaction.createMessage(`připojeno do <#${interaction.member?.voiceState.channelID}>`)
}