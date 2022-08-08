import { AnyInteractionGateway, CommandInteraction } from "eris"
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
}