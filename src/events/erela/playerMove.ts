import { Player } from "erela.js"
import { EClient } from "../../types"

export const event = {
    name: 'playerMove'
}

export const execute = (player: Player, old: string, channel: string, client: EClient) => {
    if (!channel) return player.destroy();

    player.setVoiceChannel(channel);

    if (player.paused) return;

    const ping = client.guilds.get(player.guild)?.shard.latency

    if (!ping) return;
    
    setTimeout(() => {
        player.pause(true);
        setTimeout(() => player.pause(false), ping * 2);
    }, ping * 2);
}