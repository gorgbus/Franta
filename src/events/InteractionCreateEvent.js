const { localizeString } = require("../utils/loc");
const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }

    async run(client, interaction) {
        if (!interaction.isButton()) return;

        const message = interaction.message

        if (message.author.id === client.user.id) {
            const member = interaction.member
            const role_id = interaction.customId.split("-")[1]
            
            if (member.roles.cache.some(role => role.id === role_id)) {
                member.roles.remove(role_id)

                const str = localizeString(client.lang.get("cs"), "cmd_role_removed", {
                    id: role_id
                })

                await interaction.reply({ content: str, ephemeral: true })
            } else {
                member.roles.add(role_id)

                const str = localizeString(client.lang.get("cs"), "cmd_role_added", {
                    id: role_id
                })

                await interaction.reply({ content: str, ephemeral: true })
            }
        }
    }
};
