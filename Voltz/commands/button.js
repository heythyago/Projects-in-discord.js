const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonComponent } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("button")
        .setDescription("Command to test the discord button system.")
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Choose the channel where you will send the button.')
                .setRequired(true))
        .setDefaultPermission(true),
    async execute(interaction) {
        const canal = interaction.options.getChannel("channel")
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('buttontest')
                .setLabel('Hello, I'm a button')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('👋'),
        );

        canal.send({contents: `Hi, this is a button.`, components: [row]})
        interaction.reply({content: `Mensagem de captcha enviada.`, ephemeral: true})
    }
}
