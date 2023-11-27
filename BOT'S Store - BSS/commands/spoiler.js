const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonComponent } = require("discord.js");
const Discord = require('discord.js');
const configsPath = './database/spoiler.json'; //arquivo que irá ser usado como database local

const spoilerOptions = [];

module.exports = {
    spoilerOptions,
    data: new SlashCommandBuilder()
        .setName("spoiler")
        .setDescription("Crie um spoiler!")
        .setDefaultPermission(true),
    async execute(interaction) {
        const embed = new Discord.EmbedBuilder()
            .setDescription('Clique no botão abaixo para criar um novo spoiler no canal de spoilers.')
            .setColor('GREEN')

        const row = new ActionRowBuilder() //criando um botão
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('CREATE_SPOILER')
                    .setLabel('Criar um spoiler')
                    .setStyle(ButtonStyle.Secondary)
            );

        interaction.reply({ embeds: [embed], components: [row] });
    }
    

}
