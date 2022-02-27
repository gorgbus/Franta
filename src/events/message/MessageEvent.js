const { localizeString } = require("../../utils/loc");
const GuildCfg = require("../../db/schemas/GuildCfg");
const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super("messageCreate");
    }

    async run(client, message) {
        if (message.author.bot) return;
        const guildCfg = client.configs.get(message.guild.id);

        if (!guildCfg.members.some((m) => m.Id === message.author.id)) {
            const member = {
                Id: message.author.id,
                mute: {},
            };

            await GuildCfg.findOneAndUpdate(
                {
                    guildId: message.guild.id,
                },
                {
                    $addToSet: {
                        members: member,
                    },
                }
            );

            guildCfg.members.push(member);
        }

        const prefix = guildCfg.prefix;
        if (message.content.startsWith(prefix)) {
            const lang = client.lang.get(guildCfg.lang);
            const [cmdName, ...cmdArgs] = message.content.slice(prefix.length).trim().split(/\s+/);
            const command = client.commands.get(cmdName);
            if (command) {
                if (message.member.permissions.has(command.permissions)) {
                    command.run(client, message, cmdArgs, lang);
                } else {
                    let str = localizeString(lang, "cmd_no_permissions", {
                        permissions: `${command.permissions}`,
                    });

                    message.channel.send(str);
                }
            }
        }
    }
};
