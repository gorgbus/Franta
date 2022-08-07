import { Player } from "erela.js";
import { CommandInteraction } from "eris";
import { EClient } from "./types";

export const formatTime = (s: number) => {
    let seconds = Math.floor(s / 1000) % 60,
        minutes = Math.floor(s / (1000 * 60)) % 60,
        hours = Math.floor(s / (1000 * 60 * 60)) % 24;

    const _hours = (hours < 10) ? `0${hours}` : hours;
    const _minutes = (minutes < 10) ? `0${minutes}` : minutes;
    const _seconds = (seconds < 10) ? `0${seconds}` : seconds;

    if (s < 3600000) {
      return `${_minutes}:${_seconds}`;
    } else {
      return `${_hours}:${_minutes}:${_seconds}`;
    }
}

export const checkPlayer = (intercation: CommandInteraction, client: EClient) => {
    const player = client.manager.players.get(intercation.guildID!);
    
    if (!player) {
        intercation.createMessage({ content: 'nic nehraje', flags: 64 });

        return false;
    }

    return player;
}

export const checkVoice = (interaction: CommandInteraction, player: Player, play: boolean) => {
    if (!interaction.member?.voiceState.channelID) {
        interaction.createMessage({ content: 'musíš být v roomce', flags: 64 });
        
        return false;
    }

    if (play) return true;

    if (interaction.member.voiceState.channelID !== player.voiceChannel) {
        interaction.createMessage({ content: 'musíš být ve stejné roomce', flags: 64 });

        return false;
    }

    return true;
}

export const checkPlayerAndVoice = (intercation: CommandInteraction, client: EClient) => {
    const player = checkPlayer(intercation, client);

    if (!player) return false;

    const channel = checkVoice(intercation, player, false);

    if (!channel) return false;

    return player;
}