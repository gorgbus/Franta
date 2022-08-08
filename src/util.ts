import { Player } from "erela.js";
import { ApplicationCommandStructure, CommandInteraction } from "eris";
import fs from 'fs';
import path from 'path';
import { commandCallback, EClient } from "./types";

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

const getCommandFiles = () => {
    const commandsPath = path.join(__dirname, 'commands');
    const allFiles = fs.readdirSync(commandsPath);

    let commandFiles = allFiles.filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    const commandDirs = allFiles.filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

    for (let commandDir in commandDirs) {
        commandDir = commandDirs[commandDir];

        const commandDirPath = path.join(commandsPath, commandDir);

        const commands = fs.readdirSync(commandDirPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        commandFiles = [...commandFiles, ...commands.map(command => `${commandDir}/${command}`)];
    }

    return commandFiles;
}

export const updateGuildCommands = (client: EClient, guild: string) => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = getCommandFiles();

    commandFiles.map(async (file) => {
        const filePath = path.join(commandsPath, file);
        const { command, execute }: { command: ApplicationCommandStructure; execute: commandCallback } = await import(filePath);

        client.commands.set(command.name, execute);
        client.createGuildCommand(guild, command);
    });
}

export const updateCommands = (client: EClient) => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = getCommandFiles();

    client.commands = new Map();

    client.guilds.map(async (guild) => {
        const commands = await client.getGuildCommands(guild.id);
        const comandNames: string[] = [];

        for (let file in commandFiles) {
            file = commandFiles[file];

            const filePath = path.join(commandsPath, file);
            const { command, execute }: { command: ApplicationCommandStructure; execute: commandCallback } = await import(filePath);

            comandNames.push(command.name);

            client.commands.set(command.name, execute);
            const savedCommand = commands.find(cmd => cmd.name === command.name);

            if (savedCommand)
                client.editGuildCommand(guild.id, savedCommand.id, command);
            else
                client.createGuildCommand(guild.id, command);
        }

        commands.filter(command => !comandNames.includes(command.name)).map(command => {
            client.deleteGuildCommand(guild.id, command.id);
        });
    })
}