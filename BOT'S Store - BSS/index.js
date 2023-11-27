
const fs = require("node:fs");
const path = require("node:path")
const { Client, ChannelType, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActivityType, PermissionFlagsBits, Permissions, MessageManager, Embed, Collection, Events, GuildMember, GuildHubType, AuditLogEvent, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { AuditLogAction } = require('discord.js');
const Discord = require("discord.js")
const { REST, Routes } = require('discord.js');
const { clientId, token, ownerID } = require('./config.json');
const wait = require('node:timers/promises').setTimeout;
const discordTranscripts = require('discord-html-transcripts');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Recarregando ${commands.length} comandos em slash.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Recarregados ${data.length} comandos em slash.`);
	} catch (error) {
		console.error(error);
	}
})();

const client = new Client({ intents: [Object.keys(GatewayIntentBits), GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFile) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log("algum comando deu erro")
    }
}

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    

    if(!command){
        console.error('Sem comandos na pasta')
        return;
    }

    try{
        command.execute(interaction);
    } catch (error){
        console.error(error)
        interaction.reply({content: 'O Bot teve algum erro'})
    }
})
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
  const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|webp)/gi; //Codigo ultramente secreto
  const CARGOCEO = '1234567890'; // Cargo que você quer que possa mandar links no servidor.

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    try {
        if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg') || message.content.includes('discord.io')) {
      const allowedRole = message.guild.roles.cache.get(CARGOCEO);
      if (allowedRole && message.member.roles.cache.has(allowedRole.id)) {
        return;
      }
      message.delete(); //Aqui, ele irá apagar a mensagem se a mensagem conter algum link.
    }
    } catch (error) {
        console.error(error)
    }
  });
process.on('unhandledRejection', error => {
  console.error('Erro:', error);
});
process.on('uncaughtException', error => {
  console.error('Erro:', error);
});


client.login(token)
