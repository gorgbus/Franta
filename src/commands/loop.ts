import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { IClient } from "..";

export default {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop command')
        .addSubcommand(sub => (
            sub
                .setName('song')
                .setDescription('song který teď hraje se bude přehrávat dokola')
                .addBooleanOption(opt => (
                    opt
                        .setName('dokola')
                        .setDescription('vypni/zapni loop')
                        .setRequired(true)
                ))
        ))
        .addSubcommand(sub => (
            sub
                .setName('fronta')
                .setDescription('bude přehrávat celou frontu dokola')
                .addBooleanOption(opt => (
                    opt
                        .setName('dokola')
                        .setDescription('vypni/zapni loop')
                        .setRequired(true)
                ))
        ))
    ,
    
    execute: async (interaction: CommandInteraction, client: IClient) => {
        if (!interaction.inCachedGuild()) return;

        if (!interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být v hlasovém kanálu', ephemeral: true });

        const player = client.manager.players.get(interaction.guildId);

        if (!player) return interaction.reply({ content: 'nic nehraje', ephemeral: true });

        if (player.voiceChannel !== interaction.member.voice.channelId) return interaction.reply({ content: 'musíš být ve stejném hlasovém kanálu', ephemeral: true });

        const loop = interaction.options.getBoolean('dokola');

        if (interaction.options.getSubcommand() === 'song') {
            player.setTrackRepeat(loop!);

            if (loop) {
                return interaction.reply(`${player.queue.current?.title} se teď přehrává dokola`)
            } else {
                return interaction.reply(`loop byl zrušen`);
            }
        } else {
            player.setQueueRepeat(loop!)

            if (loop) {
                return interaction.reply(`fronta se teď přehrává dokola`)
            } else {
                return interaction.reply(`loop byl zrušen`);
            }
        };
    }
}