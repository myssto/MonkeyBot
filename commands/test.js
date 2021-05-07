const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const guildSettings = require('../schema/guildSchema');

module.exports = {
    name: "test",
    description: "a test command!",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Admin",
    alias: ["test"],
    disabled: false,
    async execute(message, args){ 
        
        let result = await guildSettings.create({
            _id: message.guild.id,
            prefix: '-',
        });
        result.save();

    }
}