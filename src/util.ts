// import { Player } from "erela.js";
import { CommandInteraction } from "eris";
import fs from "fs";
import path from "path";
import { command, EClient } from "./types";
import { KazagumoPlayer } from "kazagumo";

export const formatTime = (s?: number) => {
    if (!s) return "00:00"

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
        intercation.createMessage({ content: "nic nehraje", flags: 64 });

        return false;
    }

    return player;
}

export const checkVoice = (interaction: CommandInteraction, player: KazagumoPlayer, play: boolean) => {
    if (!interaction.member?.voiceState.channelID) {
        interaction.createMessage({ content: "musíš být v roomce", flags: 64 });
        
        return false;
    }

    if (play) return true;

    if (interaction.member.voiceState.channelID !== player.voiceId) {
        interaction.createMessage({ content: "musíš být ve stejné roomce", flags: 64 });

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
    const commandsPath = path.join(__dirname, "commands");
    const allFiles = fs.readdirSync(commandsPath);

    let commandFiles = allFiles.filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    const commandDirs = allFiles.filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

    for (let commandDir in commandDirs) {
        commandDir = commandDirs[commandDir];

        const commandDirPath = path.join(commandsPath, commandDir);

        const commands = fs.readdirSync(commandDirPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
        commandFiles = [...commandFiles, ...commands.map(command => `${commandDir}/${command}`)];
    }

    return commandFiles;
}

export const updateGuildCommands = (client: EClient) => {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = getCommandFiles();

    client.commands = new Map();

    client.guilds.map(async (guild) => {
        const commands = await client.getGuildCommands(guild.id);
        const comandIds: string[] = [];

        for (let file in commandFiles) {
            file = commandFiles[file];

            const filePath = path.join(commandsPath, file);
            const { default: { command, execute, permission } }: command = await import(filePath);

            client.commands.set(command.name, { execute, permission });
            const savedCommand = commands.find(cmd => cmd.name === command.name);

            if (savedCommand) {
                const updatedCmd = await client.editGuildCommand(guild.id, savedCommand.id, command);
                
                comandIds.push(updatedCmd.id);
            } else {
                const newCmd = await client.createGuildCommand(guild.id, command);

                comandIds.push(newCmd.id);
            }
        }

        commands.filter(command => !comandIds.includes(command.id)).map(command => {
            client.deleteGuildCommand(guild.id, command.id);
        });
    })
}

export const updateCommands = async (client: EClient) => {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = getCommandFiles();

    client.commands = new Map();

    const commands = await client.getCommands();
    const comandIds: string[] = [];

    for (let file in commandFiles) {
        file = commandFiles[file];

        const filePath = path.join(commandsPath, file);
        const { default: { command, execute, permission } }: command = await import(filePath);

        client.commands.set(command.name, { execute, permission });
        const savedCommand = commands.find(cmd => cmd.name === command.name);

        if (savedCommand) {
            const updatedCmd = await client.editCommand(savedCommand.id, command);
            
            comandIds.push(updatedCmd.id);
        } else {
            const newCmd = await client.createCommand(command);
            comandIds.push(newCmd.id);
        }
    }
    commands.filter(command => !comandIds.includes(command.id)).map(command => {
        client.deleteCommand(command.id);
    });
}