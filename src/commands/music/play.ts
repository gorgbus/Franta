import { ApplicationCommandStructure, CommandInteraction, Embed, InteractionDataOptions } from "eris";
import { EClient } from "../../types";
import { checkVoice, formatTime } from "../../util";

export default {
    command: {
        name: "play",
        nameLocalizations: {
            cs: "hraj"
        },
        description: "play videos/music",
        descriptionLocalizations: {
            cs: "přehraje videa"
        },
        type: 1,
        options: [
            {
                name: "query",
                name_localizations: {
                    cs: "vyhledávání"
                },
                description: "what you want to search",
                description_localizations: {
                    cs: "co chceš najít"
                },
                required: true,
                type: 3
            },
            {
                name: "platform",
                name_localizations: {
                    cs: "platforma"
                },
                description: "choose on which platform you want to search",
                description_localizations: {
                    cs: "vyber na jaké platformě chceš vyhledávat"
                },
                choices: [
                    {
                        name: "YouTube",
                        value: "youtube"
                    },
                    {
                        name: "SoundCloud",
                        value: "soundcloud"
                    }
                ],
                type: 3
            }
        ]
    } as ApplicationCommandStructure,
    execute: async (client: EClient, interaction: CommandInteraction) => {
        const source = (interaction.data.options?.find(str => str.name === "platform" && str.type === 3)?.value || "youtube") as string;
        const query = interaction.data.options?.find(str => str.name === "query" && str.type === 3)?.value as string;
        
        if (!source || !query) return interaction.createMessage({ content: "Něco se pokazilo", flags: 64 });

        const res = await client.manager.search(query, { engine: source, requester: interaction.member });

        let player = client.manager.players.get(interaction.guildID!);

        if (!player) {
            if (!checkVoice(interaction, player!, true)) return;

            player = await client.manager.createPlayer({
                guildId: interaction.guildID!,
                textId: interaction.channel.id,
                voiceId: interaction.member?.voiceState.channelID!,
            });
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
            type: "play",
            description: `**[${song.title}](${song.uri})**\n bylo přidáno do fronty`,
            thumbnail: {
                url: song.thumbnail!
            },
            footer: {
                text: `Trvání: ${formatTime(song.length)}`
            }
        }

        return interaction.createMessage({ embeds: [embed] });
    }
}