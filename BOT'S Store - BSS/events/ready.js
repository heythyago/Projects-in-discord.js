const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady, //chamando o evento ready
	once: true,
	execute(client) {
		    console.log("O Bot foi ligado.") // avisa quando o for ligado.

    client.user.setPresence({
        activities: [{ name: `discord.gg/gcAVbN2s2q`, type: ActivityType.Playing }], //Discord da minha loja :) se você estiver usando o vsc (Visual Studio Code) pra mudar de playing basta apertar control + space que ele mostrará as sugestões de qual modo você pode colocar no seu bot.
        status: 'dnd', //define o status bot, por exemplo, quando ele está no ocupado, online, afk ou invisible
      });
	},
};
