const { ApplicationCommandType, ApplicationCommandOptionType, InteractionType, EmbedBuilder } = require('discord.js');
const { findMember, hhmmss } = require('@util/common');
const dbhelper = require('@util/dbhelper');
const moment = require('moment');

module.exports = {
    name: "user",
    description: "Displays user information",
    usage: `\`${process.env.PREFIX}user <target>\``,
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'Get the info of this user',
            required: false
        }
    ],
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        let guildMember;

        if (isSlash) {
            guildMember = await findMember(interaction.options.getUser('user'), interaction);
            if(!guildMember) guildMember = interaction.member;
            const finalEmbed = await buildEmbed(guildMember);
            return interaction.reply({ embeds: [finalEmbed] });
        } else {
            if(args[0]) {
                guildMember = await findMember(args[0], interaction);
                if(!guildMember) return interaction.reply(`Couldn't find desired user!`);
                guildMember = interaction.member;
            }
            const finalEmbed = await buildEmbed(guildMember);
            return interaction.reply({ embeds: [finalEmbed] });
        }

        async function buildEmbed(member) {
            const userdata = await dbhelper.getGuildUserProfile(interaction.guildId, member.id);
            const nicknames = !userdata.nicknames ? ["No Nicknames Logged"] : userdata.nicknames;
            const vcTime = !userdata.vcTime ? 'None' : hhmmss(userdata.vcTime);
            const msgCount = !userdata.msgCount ? 'None' : userdata.msgCount;

            const userEmbed = new EmbedBuilder()
                .setColor(member.displayHexColor)
                .addFields(
                    { name: 'User Info', value: `Joined Server: \`${moment(member.joinedAt).format("MM/d/YYYY, h:mm:ss a")}\`\nCreated on: \`${moment(member.user.createdAt).format("MM/d/YYYY, h:mm:ss a")}\`\nUser ID: \`${member.id}\`` },
                    { name: 'Past Nicknames', value: `${nicknames.join(', ')}` },
                    { name: 'Interaction', value: `Time in VC: \`${vcTime}\`\nMessages Sent: \`${msgCount}\`` }
                )
                .setDescription(`<@${member.id}> (${member.user.tag})`)
                .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }));
            return userEmbed;
        }
    }
};