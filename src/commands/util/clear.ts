import { ApplicationCommandStructure, CommandInteraction } from "eris";
import { EClient } from "../../types";

export default {
    command: {
        name: "clear",
        nameLocalizations: {
            cs: "vymazat"
        },
        description: "deletes number of specified messages",
        descriptionLocalizations: {
            cs: "vymaže určitý počet zpráv",
        },
        type: 1,
        options: [
            {
                name: "amount",
                name_localizations: {
                    cs: "počet"
                },
                description: "number of messages to be deleted",
                description_localizations: {
                    cs: "počet zpráv, které se vymažou"
                },
                required: true,
                max_value: 100,
                min_value: 1,
                type: 4
            },
            {
                name: "user",
                name_localizations: {
                    cs: "uživatel"
                },
                description: "deletes messages only from specified user",
                description_localizations: {
                    cs: "vymaže zprávy pouze od vybraného uživatele"
                },
                type: 6
            }
        ]
    } as ApplicationCommandStructure,
    permission: BigInt(0x2000),
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const amount = interaction.data.options?.find(opt => opt.name === "amount")?.value as number;
        const user = interaction.data.options?.find(opt => opt.name === "user")?.value;

        const channel = interaction.channel;

        const messages = user ? await channel.getMessages() : await channel.getMessages({ limit: amount });

        const toBeDeleted: string[] = [];

        if (user) {
            let i = 0;

            messages.forEach(msg => {
                if (i < amount && msg.author.id === user) {
                    i++;

                    toBeDeleted.push(msg.id);
                }
            });
        } else {
            messages.forEach(msg => {
                toBeDeleted.push(msg.id);
            });
        }

        client.deleteMessages(channel.id, toBeDeleted, "clear command");
        interaction.createMessage({ content: `vymazáno \`${toBeDeleted.length}\` zpráv`, flags: 64 });
    }
}