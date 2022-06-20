import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { IClient } from "..";

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip command'),
    
    execute: async (interaction: CommandInteraction, client: IClient) => {
        if (!interaction.inCachedGuild()) return;

        if (!interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být v hlasovém kanálu', ephemeral: true });

        const player = client.manager.players.get(interaction.guildId);

        if (!player || !player.queue.current) return interaction.reply({ content: 'nic nehraje', ephemeral: true });

        if (player.voiceChannel !== interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být ve stejném hlasovém kanálu', ephemeral: true });

        const song = player.queue.current;

        const embed = new MessageEmbed()
            .setDescription(`**[${song?.title}](${song?.uri})**\n bylo přeskočeno`)
            .setThumbnail(song?.thumbnail!);
        
        player.stop();

        interaction.reply({ embeds: [embed] });
    }
}