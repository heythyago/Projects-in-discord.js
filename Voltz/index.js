
//MADE BY HEYTHYAGO | ! Thiago.#6985

process.noDeprecation = true;
const fs = require("node:fs");
const path = require("node:path")
const { Client, ChannelType, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActivityType, PermissionFlagsBits, Permissions, MessageManager, Embed, Collection, Events, GuildMember, GuildHubType, AuditLogEvent, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { AuditLogAction } = require('discord.js');
const Discord = require("discord.js")
const { REST, Routes } = require('discord.js');
const { clientId, token, ownerID } = require('./config.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const wait = require('node:timers/promises').setTimeout;

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Reloading ${commands.length} commands in slash.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Reloaded ${data.length} commands in slash.`);
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
        console.log("some command gave an error")
    }
}

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    

    if(!command){
        console.error('No commands in folder')
        return;
    }

    try{
        command.execute(interaction);
    } catch (error){
        console.error(error)
        interaction.reply({content: 'Bot had some error'})
    }
})

client.on(Events.ClientReady, async (c) => {
    console.log("The bot has been turned on.") 
    console.log("MADE BY HEYTHYAGO | ! Thiago.#6985")


    client.user.setPresence({
        activities: [{ name: `github.com/heythyago/`, type: ActivityType.Playing }],
        status: 'dnd',
      });
});


client.login(token)
