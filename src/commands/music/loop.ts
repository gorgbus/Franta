import { ApplicationCommandStructure, CommandInteraction, Constants, InteractionDataOptions } from "eris";
import { EClient, subcommand } from "../../types";
import { checkPlayerAndVoice } from "../../util";

export const command: ApplicationCommandStructure = {
    name: 'loop',
    description: 'loopne song, který teď hraje nebo celou frontu',
    type: 1,
    options: [
        {
            name: 'song',
            description: 'loopne song, který teď hraje',
            type: 1,
            options: [
                {
                    name: 'looped',
                    description: 'vypni/zapni loop',
                    required: true,
                    type: 5
                }
            ]
        },
        {
            name: 'queue',
            description: 'loopne celou frontu',
            type: 1,
            options: [
                {
                    name: 'looped',
                    description: 'vypni/zapni loop',
                    required: true,
                    type: 5
                }
            ]
        }
    ]
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const player = checkPlayerAndVoice(interaction, client);
    
    if (!player) return;

    const command = interaction.data.options as subcommand[];

    if (!command) throw new Error('něco se nepovedlo');

    const loop = command[0].options[0].value as boolean;

    if (command[0].name === 'song')
        player.setTrackRepeat(loop);
    else
        player.setQueueRepeat(loop);

    if (loop)
        interaction.createMessage(`${command[0].name === 'song' ? player.queue.current?.title: 'celá fronta'} se teď přehrává dokola`);
    else
        interaction.createMessage('loop byl zrušen');
}