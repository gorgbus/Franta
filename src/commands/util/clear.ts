import { ApplicationCommandStructure, CommandInteraction, Constants } from "eris";
import { EClient } from "../../types";

export const command: ApplicationCommandStructure = {
    name: 'clear',
    description: 'vymaže určitý počet zpráv',
    descriptionLocalizations: {
        'en-US': 'deletes number of specified messages',
    },
    type: 1,
    options: [
        {
            name: 'amount',
            description: 'počet zpráv',
            required: true,
            max_value: 100,
            min_value: 1,
            type: 4
        },
        {
            name: 'user',
            description: 'vymaže zprávy pouze od určeného uživatele',
            type: 6
        }
    ]
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const amount = interaction.data.options?.find(opt => opt.name === 'amount')?.value as number;
    const user = interaction.data.options?.find(opt => opt.name === 'user')?.value;

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

    client.deleteMessages(channel.id, toBeDeleted, 'clear command');
    interaction.createMessage({ content: `vymazáno \`${toBeDeleted.length}\` zpráv`, flags: 64 });
}