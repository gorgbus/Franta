import { ApplicationCommandStructure, CommandInteraction, Constants } from "eris";
import { EClient } from "../../types";
import { checkPlayerAndVoice } from "../../util";

export default {
    command: {
        name: "volume",
        nameLocalizations: {
            cs: "hlasitost"
        },
        description: "set player's volume",
        descriptionLocalizations: {
            cs: "nastavní hlasitost bota"
        },
        type: 1,
        options: [
            {
                name: "percents",
                name_localizations: {
                    cs: "procenta"
                },
                description: "volume in %",
                description_localizations: {
                    cs: "hlasitost v %"
                },
                required: true,
                min_value: 0,
                type: 4
            }
        ]
    } as ApplicationCommandStructure,
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const player = checkPlayerAndVoice(interaction, client);
        
        if (!player) return;

        const options = interaction.data.options;

        if (!options) throw new Error("něco se nepovedlo");
    
        const volume = options[0].value as number;

        player.setVolume(volume);

        interaction.createMessage(`hlasitost byla nastavena na ${volume}%`);
    }
}