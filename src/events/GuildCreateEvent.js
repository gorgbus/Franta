// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require("../utils/structures/BaseEvent");
const GuildConfig = require("../db/schemas/GuildCfg");

module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() {
        super("guildCreate");
    }

    async run(client, guild) {
        try {
            const guildCfg = await GuildConfig.create({
                guildId: guild.id,
            });
            client.configs.set(guild.id, guildCfg);
        } catch (err) {
            console.log(err);
        }
    }
};
