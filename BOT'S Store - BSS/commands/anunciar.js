const { SlashCommandBuilder } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anuncio")
        .setDescription("Envie um anúncio no seu canal de anúncios.")
        .setDefaultPermission(true),
    async execute(interaction) {
        if (!interaction.user.dmChannel) {
            await interaction.user.createDM();
        }
        const collector = interaction.user.dmChannel.createMessageCollector({ time: 60000 });//collector com o tempo de 60 segundos.
        interaction.reply({content: "Verifique sua dm", ephemeral: true});
        const embedtres = new Discord.EmbedBuilder()
        .setDescription("Digite a mensagem do anúncio.")
        .setColor("GREEN")
        await interaction.user.send({embeds: [embedtres]});
        collector.on('collect', async (collectedMessage) => {

            const anuncio = collectedMessage.content; //aqui defini para a constante anuncio ser a mensagem coletada na dm do usuário

            const canal = interaction.guild.channels.cache.get("O ID Do seu canal de anúncios");
            canal.send(anuncio);

            collector.stop(); //ele para o colletor para não mandar mais mensagens após a do anúncio, e envia o anúncio.
            const embed = new Discord.EmbedBuilder()
            .setDescription("Anúncio enviado com sucesso.")
            .setColor('GREEN');
            await interaction.user.send({ embeds: [embed]});
        });

        collector.on('end', (collected, reason) => {
            const embeddois = new Discord.EmbedBuilder()
            .setDescription("Tempo expirado para fazer o anúncio.")
            .setColor('GREEN');
            if (reason === 'time') {
                interaction.user.send({ embeds: [embeddois] });
            }
        });
    }
};
