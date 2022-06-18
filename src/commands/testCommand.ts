import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { IClient } from "..";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command')
    ,

    execute: async (interaction: CommandInteraction, client: IClient) => {
        await interaction.reply({ content: 'Příkaz byl vykonán!', ephemeral: true });
    }
}