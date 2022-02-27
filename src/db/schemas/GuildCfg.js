const mongoose = require("mongoose");

const GuildCfgSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: ">",
    },
    lang: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "cs",
    },
    members: {
        type: mongoose.SchemaTypes.Array,
        required: true,
        default: [],
    },
    DefRole: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
});

module.exports = mongoose.model("GuildCfg", GuildCfgSchema);
