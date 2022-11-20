import { ApplicationCommandStructure, CommandInteraction, Embed } from "eris";
import { EClient } from "../../types";
import { checkPlayerAndVoice } from "../../util";

export default {
    command: {
        name: "skip",
        nameLocalizations: {
            cs: "přeskočit"
        },
        description: "skip current track",
        descriptionLocalizations: {
            cs: "přeskočí to co teď hraje"
        },
        type: 1
    } as ApplicationCommandStructure,
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const player = checkPlayerAndVoice(interaction, client);
        
        if (!player) return;

        if (!player.queue.current) return interaction.createMessage({ content: "není co přeskočit", flags: 64 });

        const song = player.queue.current;

        const embed: Embed = {
            type: "skip",
            description: `**[${song?.title}](${song?.uri})**\n bylo přeskočeno`,
            thumbnail: {
                url: song.thumbnail!
            }
        }

        player.skip();

        interaction.createMessage({ embeds: [embed] });
    }
}