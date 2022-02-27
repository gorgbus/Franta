function getUserFromMention(guild, mention) {
    if (!mention) return;

    if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);

        if (mention.startsWith("!")) {
            mention = mention.slice(1);
        }

        return guild.members.cache.get(mention);
    }
}

module.exports = {
    getUserFromMention,
};
