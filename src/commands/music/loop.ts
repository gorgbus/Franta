import { ApplicationCommandStructure, CommandInteraction, Constants, InteractionDataOptions } from "eris";
import { EClient, subcommand } from "../../types";
import { checkPlayerAndVoice } from "../../util";

export default {
    command: {
        name: "loop",
        nameLocalizations: {
            cs: "opakování"
        },
        description: "loopne song, který teď hraje nebo celou frontu",
        type: 3,
        options: [
            {
                name: "type",
                name_localizations: {
                    cs: "typ"
                },
                description: "loopne song, který teď hraje",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "queue",
                        name_localizations: {
                            cs: "fronta"
                        },
                        value: "queue"
                    },
                    {
                        name: "track",
                        name_localizations: {
                            cs: "song"
                        },
                        value: "track"
                    },
                    {
                        name: "none",
                        name_localizations: {
                            cs: "zrušit"
                        },
                        value: "none"
                    }
                ]
            }
        ]
    } as ApplicationCommandStructure,
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const player = checkPlayerAndVoice(interaction, client);
        
        if (!player) return;

        const command = interaction.data.options as subcommand[];

        if (!command) throw new Error("něco se nepovedlo");

        const loop = interaction.data.options?.find(str => str.name === "type" && str.type === 3)?.value as "queue" | "track" | "none" | undefined;

        player.setLoop(loop);

        if (loop)
            interaction.createMessage(`${command[0].name === "song" ? player.queue.current?.title: "celá fronta"} se teď přehrává dokola`);
        else
            interaction.createMessage("loop byl zrušen");
    }
}