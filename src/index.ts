import { Client, Collection } from 'discord.js';
import { Manager } from 'erela.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config();

export interface IClient extends Client {
    commands: Collection<string, any>;
    manager: Manager;
}

(async () => {
    const client = new Client({
        presence: {
            activities: [
                {
                    name: 'big mad balls in ur mouth',
                    type: 'LISTENING',
                }
            ]
        },
        intents: ['GUILDS', 'GUILD_INTEGRATIONS', 'GUILD_VOICE_STATES']
    }) as IClient;

    client.commands = new Collection();
    client.manager = new Manager({
        nodes: [
            {
                host: 'localhost',
                port: 6900,
                password: process.env.LAVALINK
            }
        ],
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    })
        .on('nodeConnect', (node) => console.log(`Node ${node.options.identifier} connected`));

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    const commands: any = [];

    commandFiles.map((file) => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        client.commands.set(command.default.data.name, command.default);
        commands.push(command.default.data.toJSON());
    });

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN!);

    await client.login(process.env.TOKEN);

    client.on('ready', () => {
        console.log(`${client.user?.tag} has loggen in!`);

        client.manager.init(client.user?.id);
    });

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.APP_ID!),
            { body: commands }
        )
    } catch (err) {
        console.error(err);
    }

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);
                await interaction.reply({ content: 'Objevil se error při spouštění tohoto příkazu!', ephemeral: true });
            }
        }

        if (interaction.isButton()) {
            if (!interaction.inCachedGuild()) return;

            const message = interaction.message

            if (message.author.id === client.user?.id) {
                const member = interaction.member
                const role_id = interaction.customId.split("-")[1]
                
                if (member?.roles.cache.some(role => role.id === role_id)) {
                    member.roles.remove(role_id)

                    await interaction.reply({ content: `**-** <@&${role_id}>`, ephemeral: true })
                } else {
                    member?.roles.add(role_id)

                    await interaction.reply({ content: `**+** <@&${role_id}>`, ephemeral: true })
                }
            }
        }
    });

    client.on('raw', (d) => client.manager.updateVoiceState(d));
})();
