import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { IClient } from "..";

export default {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Volume command')
        .addStringOption(opt => 
            opt
                .setName('hlasitost')
                .setDescription('nastav hlasitost')
                .setRequired(true)
        )    
    ,
    
    execute: async (interaction: CommandInteraction, client: IClient) => {
        if (!interaction.inCachedGuild()) return;

        if (!interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být v hlasovém kanálu', ephemeral: true });

        const player = client.manager.players.get(interaction.guildId);

        if (!player) return interaction.reply({ content: 'nic nehraje', ephemeral: true });

        if (player.voiceChannel !== interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být ve stejném hlasovém kanálu', ephemeral: true });

        const volume = interaction.options.getString('hlasitost');

        player.setVolume(Number(volume));

        interaction.reply(`hlasitost byla nastavena na ${volume}%`);
    }
}