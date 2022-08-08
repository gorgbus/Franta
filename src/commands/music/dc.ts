import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";
import { checkPlayer, checkPlayerAndVoice } from "../../util";

export const command: ApplicationCommandStructure = {
    name: 'dc',
    description: 'odpojí bota z roomky',
    type: 1
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const player = checkPlayerAndVoice(interaction, client);
    
    if (!player) return;

    player.destroy();

    interaction.createMessage('posrar sesm se');
}