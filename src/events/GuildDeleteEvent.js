// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require("../utils/structures/BaseEvent");
const GuildConfig = require("../db/schemas/GuildCfg");

module.exports = class GuildDeleteEvent extends BaseEvent {
    constructor() {
        super("guildDelete");
    }

    async run(client, guild) {
        try {
            const guildCfg = await GuildConfig.findOneAndDelete({
                guildId: guild.id,
            });
            client.configs.set(guild.id, {});
        } catch (err) {
            console.log(err);
        }
    }
};
