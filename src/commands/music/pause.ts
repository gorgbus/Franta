import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";
import { checkPlayerAndVoice } from "../../util";

export const command: ApplicationCommandStructure = {
    name: 'pause',
    description: 'pozastaví bota',
    type: 1,
    options: [
        {
            name: 'paused',
            description: 'pozastaví/spustí bota',
            required: true,
            type: 5
        }
    ]
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const player = checkPlayerAndVoice(interaction, client);
    
    if (!player) return;

    const options = interaction.data.options;

    if (!options) throw new Error('něco se nepovedlo');

    const paused = options[0].value as boolean;

    player.pause(paused);

    interaction.createMessage(`<@${client.user.id}> byl ${paused ? 'pozastaven' : 'znovu spuštěn'}`);
}