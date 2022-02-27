const { localizeString } = require("../../utils/loc");
const { getUserFromMention } = require("../../utils/mentions");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class MuteCommand extends BaseCommand {
    constructor() {
        super("mute", "mod", [], ["MANAGE_ROLES"]);
    }

    run(client, message, args, lang) {
        let str = localizeString(lang, "cmd_mute_no_args");

        if (!args[0]) {
            message.channel.send(str);
            return;
        }

        let member = getUserFromMention(message.guild, args[0]);
        if (!member) member = message.guild.members.cache.get(args[0]);

        if (!member) {
            str = localizeString(lang, "cmd_mute_no_member");
            message.channel.send(str);
            return;
        }
    }
};
