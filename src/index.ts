import Eris, { ApplicationCommandStructure, CommandInteraction } from "eris";
import { Manager } from "erela.js";
import { config } from "dotenv";
import fs from 'fs';
import path from 'path';
import { commandCallback, EClient } from "./types";
config();

const client = new Eris.Client(process.env.TOKEN!, {
    intents: 33427,
}) as EClient;

client.manager = new Manager({
    nodes: [
        {
            host: process.env.LAVA_IP!,
            port: 6900,
            password: process.env.LAVALINK
        }
    ],
    send(id, paylod) {
        const guild = client.guilds.get(id);

        if (guild) guild.shard.sendWS(paylod.op, paylod.d);
    }
})
    .on('nodeConnect', (node) => {
        console.log(`Node ${node.options.identifier} connected`);
    })
    .on('playerMove', (player, old, channel) => {
        if (!channel) return player.destroy();

        player.setVoiceChannel(channel);

        if (player.paused) return;

        const ping = client.guilds.get(player.guild)?.shard.latency

        if (!ping) return;

        setTimeout(() => {
            player.pause(true);
            setTimeout(() => player.pause(false), ping * 2);
        }, ping * 2);
    });

client.on('ready', () => {
    console.log(`${client.user.username} has logged in!`);
    client.manager.init(client.user.id);

    updateCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (interaction instanceof CommandInteraction) {
        const command = client.commands.get(interaction.data.name);

        if (!command) return;

        try {
            await command(client, interaction);
        } catch(err) {
            console.error(err);

            interaction.createMessage({ content: 'Objevil se error při spouštění tohoto příkazu', flags: 64 });
        }
    }
});

client.on('guildCreate', (guild) => {
    updateGuildCommands(guild.id);
});

client.on('rawWS', (packet: any) => {
    client.manager.updateVoiceState(packet);
});

client.connect();

const updateGuildCommands = (guild: string) => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    commandFiles.map(async (file) => {
        const filePath = path.join(commandsPath, file);
        const { command, execute }: { command: ApplicationCommandStructure; execute: commandCallback } = await import(filePath);

        client.commands.set(command.name, execute);
        client.createGuildCommand(guild, command);
    });
}

const updateCommands = () => {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    client.commands = new Map();

    client.guilds.map(guild => {
        commandFiles.map(async (file) => {
            const filePath = path.join(commandsPath, file);
            const { command, execute }: { command: ApplicationCommandStructure; execute: commandCallback } = await import(filePath);

            client.commands.set(command.name, execute);
            client.createGuildCommand(guild.id, command);
        });
    })
}