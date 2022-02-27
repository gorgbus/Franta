const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { localizeString } = require("../../utils/loc");

module.exports = class RoleReactCommand extends BaseCommand {
    constructor() {
        super("rolereact", "util", ["rr"], ["MANAGE_ROLES"]);
    }

    async run(client, message, args, lang) {
        function handleCollectors(_id) {
            const filter = m => m.author.id === message.author.id;
            let filterObj
            (_id === 2) ? filterObj = { filter, max: 1, time: 60000 } : filterObj = { filter, time: 60000 }
            if (_id === 3) filterObj = { filter };

            const collector = message.channel.createMessageCollector(filterObj);

            return new Promise((resolve, reject) => {
                collector.on('collect', m => {
                    msg_array.push(m)

                    if (m.content.toLowerCase() === "cancel") {
                        collector.stop();
                        resolve();

                        channel = undefined

                        return
                    }

                    switch(_id) {
                        case 1:
                            const channelMention = m.mentions.channels.first()

                            if (channelMention) {
                                channel = channelMention

                                collector.stop();
                                resolve();
                            } else {
                                message.channel.send(str).then(m => {
                                    setTimeout(() => m.delete(), 2000)
                                })
                            }
                            break;
                        case 2:
                            const _args2 = m.content.split(" | ")

                            if (_args2.length > 1) {
                                let reg = /^#([0-9a-f]{3}){1,2}$/i;

                                desc = _args2[0];
                                (reg.test(_args2[1])) ? color = _args2[1] : color = Math.floor(Math.random()*16777215).toString(16)
                            } else {
                                desc = m.content
                                color = Math.floor(Math.random()*16777215).toString(16)
                            }
                            
                            collector.stop();
                            resolve();
                            break;
                        case 3:
                            if (m.content.toLowerCase() === "done") {
                                collector.stop();
                                resolve();
                                return
                            }
                
                            const _args = m.content.split(" - ")
                            _args[0] = _args[0].replace("<@&", "").replace(">", "")

                            const role = m.guild.roles.cache.get(_args[0])
                            const mention = m.mentions.roles.first()
                            
                            let _role = false

                            if (mention) {
                                if (mention.id === _args[0]) {
                                    console.log(m.member.roles.highest.position, mention.position)
                                    if (m.member.roles.highest.position > mention.position) {
                                        _role = mention.id
                                    } else {
                                        m.react("🔴")
                                    }
                                    
                                } else {
                                    m.react("🔴")
                                }
                            } else if (role) {
                                if (m.member.roles.highest.position > role.position) {
                                    _role = role
                                } else {
                                    m.react("🔴")
                                }
                            } else {
                                m.react("🔴")
                            }

                            if (_role && !id_array.includes(_role) && _args[1]) {
                                if (!components[index]) {
                                    const row = new MessageActionRow()
                                        .addComponents(
                                            new MessageButton()
                                                .setCustomId(m.id + "-" + _role)
                                                .setLabel(_args[1])
                                                .setStyle("PRIMARY")
                                        )

                                    components.push(row)
                                    id_array.push(_role)

                                    m.react("🟢")
                                } else {
                                    (components[index].components.length === 5) ? index++ : index

                                    components[index].addComponents(
                                            new MessageButton()
                                                .setCustomId(m.id + "-" + _role)
                                                .setLabel(_args[1])
                                                .setStyle("PRIMARY")
                                        )

                                    id_array.push(_role)

                                    m.react("🟢")
                                }
                            } else {
                                m.react("🔴")
                            }

                            break;
                    }
                });

                collector.on('end', m => {
                    resolve();
                });
            });
        }

        var msg_array = [message]

        let channel
        let str = localizeString(lang, "cmd_role_choose_channel")

        message.channel.send(str).then(m => {
            msg_array.push(m)
        })
        
        str = localizeString(lang, "cmd_role_invalid_channel")

        await handleCollectors(1)

        if (channel) {
            str = localizeString(lang, "cmd_role_valid_channel", {
                id: channel.id
            })

            message.channel.send(str).then(m => {
                msg_array.push(m)
            })
        } else {
            return
        }

        let desc
        let embed
        let color

        await handleCollectors(2)

        if (desc) {
            str = localizeString(lang, "cmd_role_preview")

            embed = new MessageEmbed()
                .setDescription(desc)
                .setColor(color)
            
            message.channel.send({ embeds: [embed], content: str }).then(m => {
                msg_array.push(m)
            })

            str = localizeString(lang, "cmd_role_await_roles", {
                id: message.guild.members.cache.get(client.user.id).roles.botRole.id
            })
        
            message.channel.send(str).then(m => {
                msg_array.push(m)
            })
        } else {
            for (let m of msg_array) {
                setTimeout(() => {
                    m.delete()
                }, 200)
            }

            return
        }

        let id_array = []
        let components = []
        let index = 1

        await handleCollectors(3)

        for (let m of msg_array) {
            setTimeout(() => {
                m.delete()
            }, 200)
        }

        if (components != [] && channel) {
            components.reverse()
            channel.send({ embeds: [embed], components })
        }

    }
};
