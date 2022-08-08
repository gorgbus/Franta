import { AnyInteractionGateway, CommandInteraction, ComponentInteraction } from "eris"
import { EClient } from "../../types"

export const event = {
    once: false,
    name: 'interactionCreate'
}

export const execute = async (interaction: AnyInteractionGateway, client: EClient) => {
    if (interaction instanceof CommandInteraction) {
        const command = client.commands.get(interaction.data.name);

        if (!command) return;

        try {
            await command(client, interaction);
        } catch(err) {
            console.error(err);

            interaction.createMessage({ content: 'Objevil se error při spouštění tohoto příkazu', flags: 64 });
        }
    }

    if (interaction instanceof ComponentInteraction) {
        if (interaction.message.author.id === client.user.id && interaction.data.component_type === 2) {
            const member = interaction.member
            const roleId = interaction.data.custom_id.split('-')[1]

            if (member?.roles.some(role => role === roleId)) {
                member.removeRole(roleId);

                interaction.createMessage({ content: `**-** <@&${roleId}>`, flags: 64 });
            } else {
                member?.addRole(roleId);

                interaction.createMessage({ content: `**+** <@&${roleId}>`, flags: 64 });
            }
        }
    }
}