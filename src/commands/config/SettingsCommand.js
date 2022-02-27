const { findByIdAndUpdate } = require("../../db/schemas/GuildCfg");
const GuildCfg = require("../../db/schemas/GuildCfg");
const { localizeString } = require("../../utils/loc");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class SettingsCommand extends BaseCommand {
    constructor() {
        super("settings", "config", [], ["MANAGE_GUILD"]);
    }

    async run(client, message, args, lang) {
        const configs = {
            prefix: {
                id: "prefix",
            },
            lang: {
                id: "lang",
                allowed: ["cs"],
            },
        };

        let str = localizeString(lang, "cmd_settings_not_included", {
            settings: `${Object.keys(configs)}`,
        });

        if (!Object.keys(configs).includes(args[0])) {
            message.channel.send(str);
            return;
        }

        const cmd = configs[args[0]];

        if (args[1]) {
            if (cmd.allowed && !cmd.allowed.includes(args[1])) {
                str = localizeString(lang, "cmd_settings_not_allowed", {
                    allowed: `${cmd.allowed}`,
                    value: `${args[1]}`,
                });
                message.channel.send(str);
                return;
            }

            if (guildCfg[cmd.id] === args[1]) {
                str = localizeString(lang, "cmd_settings_already", {
                    value: `${args[1]}`,
                    id: `${cmd.id}`,
                });
                message.channel.send(str);
                return;
            }

            const guildId = guildCfg.guildId;
            const update = {};
            update[cmd.id] = args[1];

            const _guildCfg = await GuildCfg.findOneAndUpdate(
                {
                    guildId,
                },
                update,
                {
                    new: true,
                }
            );

            client.configs.set(guildId, _guildCfg);
            str = localizeString(lang, "cmd_settings_changed", {
                value: `${_guildCfg[cmd.id]}`,
                id: `${cmd.id}`,
            });
            message.channel.send(str);
            return;
        }

        str = localizeString(lang, "cmd_settings_current", {
            value: `${guildCfg[cmd.id]}`,
            id: `${cmd.id}`,
        });
        message.channel.send(str);
    }
};
