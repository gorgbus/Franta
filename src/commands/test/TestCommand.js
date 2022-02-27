const { localizeString } = require("../../utils/loc");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class TestCommand extends BaseCommand {
    constructor() {
        super("test", "testing", [], []);
    }

    async run(client, message, args, lang) {
        message.channel.send(localizeString(lang, "test_string"));
    }
};
