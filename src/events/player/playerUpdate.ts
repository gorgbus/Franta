import { KazagumoPlayer } from "kazagumo";
import { PlayerUpdate } from "shoukaku";

export const execute = (player: KazagumoPlayer, data: PlayerUpdate) => {
    if (!data.state.connected && player.shoukaku.connection.state === 3) return player.destroy();

    player.setVoiceChannel(player.shoukaku.connection.channelId);
}