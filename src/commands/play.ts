import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { IClient } from "..";
import { formatTime } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play command')
        .addStringOption(opt => 
            opt
                .setName('platforma')
                .setDescription('Vyber na jake platforme chces vyhledavat')
                .setRequired(true)
                .addChoices(
                    { name: 'YouTube', value: 'youtube' },
                    { name: 'SoundCloud', value: 'soundcloud' }
                )
        )
        .addStringOption(opt =>
            opt
                .setName('vyhledavani')
                .setDescription('co chceš najít')
                .setRequired(true)
        )
    ,
    
    execute: async (interaction: CommandInteraction, client: IClient) => {
        if (!interaction.inCachedGuild()) return;

        if (!interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být v hlasovém kanálu', ephemeral: true });

        const source = interaction.options.getString('platforma') as 'youtube' | 'soundcloud' | undefined;
        const query = interaction.options.getString('vyhledavani');

        if (!source || !query) return;

        const res = await client.manager.search({ source, query });

        let player = client.manager.players.get(interaction.guildId);

        if (!player) {
            player = client.manager.create({
                guild: interaction.guildId,
                voiceChannel: interaction.member.voice.channel?.id,
                textChannel: interaction.channelId,
            });

            player.connect();
        } else {
            if (player.voiceChannel !== interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být ve stejném hlasovém kanálu', ephemeral: true });
        }

        const song = res.tracks[0]
        player.queue.add(song);

        if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
        }

        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) {
            player.play();
        }

        const embed = new MessageEmbed()
            .setDescription(`**[${song.title}](${song.uri})**\n bylo přidáno do fronty`)
            .setThumbnail(song.thumbnail!)
            .setFooter({ text: `Trvání: ${formatTime(song.duration)}` });


        interaction.reply({ embeds: [embed] });
    }
}