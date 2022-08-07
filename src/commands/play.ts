import { ApplicationCommandStructure, CommandInteraction, Constants, Embed, InteractionDataOptions } from "eris";
import { EClient } from "../types";
import { checkVoice, formatTime } from "../util";

export const command: ApplicationCommandStructure = {
    name: 'play',
    description: 'přehraje videa',
    type: 1,
    options: [
        {
            name: 'platforma',
            description: 'vyber na jaké platformě chceš vyhledávat',
            required: true,
            choices: [
                {
                    name: 'YouTube',
                    value: 'youtube'
                },
                {
                    name: 'SoundCloud',
                    value: 'soundcloud'
                }
            ],
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'vyhledávání',
            description: 'co chceš najít',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
}

export const execute = async (client: EClient, interaction: CommandInteraction) => {
    const source = interaction.data.options?.find(str => str.name === 'platforma' && str.type === 3) as sourceType;
    const query = interaction.data.options?.find(str => str.name === 'vyhledávání' && str.type === 3) as queryType;
    
    if (!source || !query) return interaction.createMessage({ content: 'Něco se pokazilo', flags: 64 });

    const res = await client.manager.search({ source: source.value, query: query.value });

    let player = client.manager.players.get(interaction.guildID!);

    if (!player) {
        if (!checkVoice(interaction, player!, true)) return;

        player = client.manager.create({
            guild: interaction.guildID!,
            voiceChannel: interaction.member?.voiceState.channelID!,
            textChannel: interaction.channel.id,
        });

        player.connect();
    } else {
        if (!checkVoice(interaction, player, false)) return;
    }

    const song = res.tracks[0]
    player.queue.add(song);

    if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
    }

    if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) {
        player.play();
    }

    const embed: Embed = {
        type: 'play',
        description: `**[${song.title}](${song.uri})**\n bylo přidáno do fronty`,
        thumbnail: {
            url: song.thumbnail!
        },
        footer: {
            text: `Trvání: ${formatTime(song.duration)}`
        }
    }

    return interaction.createMessage({ embeds: [embed] });
}

type sourceType = InteractionDataOptions & {
    value: "youtube" | "soundcloud" | undefined;
}

type queryType = InteractionDataOptions & {
    value: string;
}