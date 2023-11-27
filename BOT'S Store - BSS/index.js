
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

client.on("interactionCreate", async (interaction) => {
  const customId = interaction.customId;
  if (customId === 'CREATE_SPOILER') {
      const modal = new ModalBuilder()
          .setCustomId('SPOILER_MODAL')
          .setTitle('Criar spoiler');

      const msgInput = new TextInputBuilder()
          .setCustomId('spoiler_pergunta1')
          .setLabel('Qual o texto do spoiler?')
          .setStyle(TextInputStyle.Paragraph);
      const msg2Input = new TextInputBuilder()
          .setCustomId('spoiler_pergunta2')
          .setLabel('Qual o texto de exibição??')
          .setStyle(TextInputStyle.Paragraph);
      const urlInput = new TextInputBuilder()
          .setCustomId('spoiler_pergunta3')
          .setLabel('Link do print que deseja colocar no spoiler:')
          .setStyle(TextInputStyle.Short);

      const primeiro = new ActionRowBuilder().addComponents(msgInput);
      const segundo = new ActionRowBuilder().addComponents(msg2Input);
      const terceiro = new ActionRowBuilder().addComponents(urlInput);

      modal.addComponents(primeiro, segundo, terceiro);

      interaction.showModal(modal)
  }

  if (customId === 'SHOW_SPOILER') {
      try {
          const data = JSON.parse(fs.readFileSync(configsPath, 'utf8'));
          //verifica se o dados existem
          if (!data.spoilers) {
              console.error('Dados de spoiler não encontrados.');
              return;
          }
          const spoilerData = data.spoilers;
          const { participants } = spoilerData;
          //verifica se pessoas clicaram no spoiler
          if (!participants) {
              console.error('Dados de participantes não encontrados.');
              return;
          }
          const embed = new Discord.EmbedBuilder()
              .setDescription(spoilerData.msg)
              .setImage(spoilerData.url)
              .setColor('GREEN');
          interaction.reply({embeds: [embed], ephemeral: true });
          let spoilersCounter = spoilerData.participants.length
          if (!participants.includes(interaction.user.id)) {
            participants.push(interaction.user.id);
            spoilersCounter++;
        }
          const row = new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('SHOW_SPOILER')
                      .setLabel(`Ver spoiler: [${spoilersCounter}]`)
                      .setStyle(ButtonStyle.Secondary)
              )
          try {
              interaction.message.edit({ components: [row] })
          } catch (error) {
              console.log('Não foi possível atualizar o botão agora.');
          }
          if (!participants.includes(interaction.user.id)) {
              participants.push(interaction.user.id);
          }
          fs.writeFile(configsPath, JSON.stringify(data, null, 2), (err) => {
              if (err) {
                  console.error('Erro ao escrever no arquivo spoiler.json:', err);
              } else {
                  console.log(`${interaction.user.username} clicou no spoiler.`);
              }
          });
      } catch (error) {
          console.error('Erro ao ler ou analisar o arquivo de configurações:', error);
      }
  }
  if (customId === 'SPOILER_MODAL') {
      const dados = JSON.parse(fs.readFileSync(configsPath, 'utf8'));
      const msg = interaction.fields.getTextInputValue('spoiler_pergunta1');
      const msg2 = interaction.fields.getTextInputValue('spoiler_pergunta2');
      const url = interaction.fields.getTextInputValue('spoiler_pergunta3');
      dados.spoilers = {
          msg: msg,
          url: url,
          participants: []
      };
      fs.writeFile(configsPath, JSON.stringify(dados, null, 2), 'utf8', (err) => {
          if (err) {
              console.error('Erro ao escrever o arquivo configuravel:', err);
              return;
          }
      });
      const embed = new Discord.EmbedBuilder()
          .setTitle('NOVO SPOILER')
          .setDescription(msg2)
          .setColor('GREEN')
      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('SHOW_SPOILER')
                  .setLabel('Ver spoiler')
                  .setStyle(ButtonStyle.Secondary)
          )
      interaction.reply({ content: 'O Spoiler foi criado.', ephemeral: true })
      interaction.channel.send({embeds: [embed], components: [row] })
  }

});

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
