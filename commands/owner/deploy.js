const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: "deploy",
    description: "Deploy slash commands",
    usage: `\`${process.env.PREFIX}deploy\``,
    disabled: false,
    async execute(interaction, args, client) {
        if(interaction.author.id !== process.env.OWNERID) return;

        const cmds = client.commands
            .filter(command => command.slash)
            .map(command => {
                const {
                    name,
                    type = ApplicationCommandType.ChatInput,
                    description = "Missing description",
                    options = [],
                    dm_permission = false,
                    permission = null,
                } = command;
                const cmd = { name, type, description, options, dm_permission, default_member_permissions: permission };
                return cmd;
            });

        if (!args.length) {
            await interaction.guild.commands?.set(cmds);
            interaction.reply(`Registered ${cmds.length} commands to this guild!`);
        } else {
            await client.commands?.set(cmds);
            interaction.reply(`Registered ${cmds.length} commands globally!`);
        }
    }
};