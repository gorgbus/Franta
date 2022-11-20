import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";
import { checkPlayer, checkPlayerAndVoice } from "../../util";

export default {
    command: {
        name: "dc",
        nameLocalizations: {
            cs: "odpojit"
        },
        description: "disconnect the player",
        descriptionLocalizations: {
            cs: "odpojí bota z roomky"
        },
        type: 1
    } as ApplicationCommandStructure,
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const player = checkPlayerAndVoice(interaction, client);
        
        if (!player) return;

        player.destroy();

        interaction.createMessage("posrar sesm se");
    }
}