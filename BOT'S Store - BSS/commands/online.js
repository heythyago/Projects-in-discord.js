const { SlashCommandBuilder, MessageAttachment, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const axios = require('axios');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("online")
        .setDescription("Informações de servidor de minecraft.")//Você também pode modificar este comando pra adicionar uma opção, e chama-la na constante serverIP
        .setDefaultPermission(true),
    async execute(interaction) {
        const serverIP = 'hypixel.net';

        axios.get(`https://mcstatus.snowdev.com.br/api/query/v3/${serverIP}`)
        .then(async(response) => {       
            try {
                    const status = response.data.online ? 'Online' : 'Offline';
                    const playersonlinemax = `${response.data.players_online}/${response.data.max_players}`
                    const embed = new Discord.EmbedBuilder()
                    .setDescription(`# INFO \n**IP: **\`${serverIP}\`\n**Status:** ${status)\nPlayers: ${playersonlinemax}`)
                    .setThumbnail(response.data.favicon)
                    .setColor("GREEN");
                    await interaction.reply({embeds: [embed]});
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    }
}
