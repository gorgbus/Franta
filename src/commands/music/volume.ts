import { ApplicationCommandStructure, CommandInteraction, Constants } from "eris";
import { EClient } from "../../types";
import { checkPlayerAndVoice } from "../../util";

export const command: ApplicationCommandStructure = {
    name: 'volume',
    description: 'nastavní hlasitost bota',
    type: 1,
    options: [
        {
            name: 'percents',
            description: 'hlasitost',
            required: true,
            min_value: 0,
            type: 4
        }
    ]
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const player = checkPlayerAndVoice(interaction, client);
    
    if (!player) return;

    const options = interaction.data.options;

    if (!options) throw new Error('něco se nepovedlo');
   
    const volume = options[0].value as number;

    player.setVolume(volume);

    interaction.createMessage(`hlasitost byla nastavena na ${volume}%`);
}