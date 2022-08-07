import { ApplicationCommandStructure, CommandInteraction, Embed } from "eris";
import { EClient } from "../types";
import { checkPlayerAndVoice } from "../util";

export const command: ApplicationCommandStructure = {
    name: 'skip',
    description: 'přeskočí to co teď hraje',
    type: 1
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const player = checkPlayerAndVoice(interaction, client);
    
    if (!player) return;

    if (!player.queue.current) return interaction.createMessage({ content: 'není co přeskočit', flags: 64 });

    const song = player.queue.current;

    const embed: Embed = {
        type: 'skip',
        description: `**[${song?.title}](${song?.uri})**\n bylo přeskočeno`,
        thumbnail: {
            url: song.thumbnail!
        }
    }

    player.stop();

    interaction.createMessage({ embeds: [embed] });
}