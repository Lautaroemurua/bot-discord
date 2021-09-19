
require('dotenv').config()
const Discord = require('discord.js');
const Voice = require('@discordjs/voice');
const config = require(`${process.cwd()}`)
const intents = new Discord.Intents(32767)
const { getVoiceConnection, createAudioResource, StreamType } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const { join } = require('path');


const client = new Discord.Client({ intents })

// const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.login(process.env.TOKEN).catch((e) => {
  console.log(e);
  process.disconnect();
  process.destroy();
});

client.on('ready', () => {
  console.log(`El ${client.user.tag.split('#')[0]} esta ATR!`);
  client.user.setStatus('idle');
});

const responseBot = {
  ux: ["Solo sé que 🌟No ferpa, no party 😎🌟"],
  dev: ["Raaaaaarooo 🤓"],
  qa: ["No sé, después le preguntamos a Santi 😝"]
}

client.on('messageCreate', async message => {
  let prefix = "!";
  if (message.channel.type === 'dm') return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  message.react("👍")

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  switch (command) {
    case 'play':
      let search = args.join(' ');
      const channelVoice = message.member.voice.channel;
      if (!channelVoice || channelVoice.type !== 'GUILD_VOICE') {
        message.channel.send('Para poder escuchar musica tenes que estar en un canal de voz.').catch(error => message.channel.send(error));
      } else if (Voice) {
        await joinChannelVoice(message, search, channelVoice);
      } else {
        console.log('cayo aca');
      }
      break;

    case 'quit':
      // var canalVoz = message.member.voice.channel;
      const connection = getVoiceConnection(client.voice.channel);
      console.log(client);
      // const connection = false;
      if (!connection) {
        message.channel.send('No estoy en un canal de voz.');
      } else {
        message.channel.send('Dejando el canal de voz.').then(() => {
          Voice(botChannel.guild.id)
          connection.destroy();
        }).catch(error => message.channel.send(error));
      }
      break
    case "audio":
      const player = Voice.createAudioPlayer();
      try {
        // An AudioPlayer will always emit an "error" event with a .resource property
        player.on('error', error => {
          console.error('Error:', error.message, 'with track', error.resource.metadata.title);
        });

        const resource = Voice.createAudioResource('/21.mp3', {
          metadata: {
            title: 'A good song!',
          },
        });
        // resource.volume.setVolume(0.5);
        player.play(resource);
        console.log('hasta aca todo bien')
      } catch (error) {
        console.log(error);
      }

      break;
    case "ux":
      rndIndex = Math.floor(Math.random() * responseBot.ux.length)
      replyMessage = responseBot.ux[rndIndex].toString()
      message.reply(replyMessage);
      break;

    case "dev":
      rndIndex = Math.floor(Math.random() * responseBot.dev.length)
      replyMessage = responseBot.dev[rndIndex].toString()
      message.reply(replyMessage);
      break;

    case "qa":
      rndIndex = Math.floor(Math.random() * responseBot.qa.length)
      replyMessage = responseBot.qa[rndIndex].toString()
      message.reply(replyMessage);
      break;
    default:
      break;
  }

})

async function joinChannelVoice(message, search, channel) {
  try {
    message.channel.send(`Intentando unirme al canal ${channel.name}...`);
    const voiceConnection =
      Voice.joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

    sendEmbedMessage(message, search);
    try {
      const player = Voice.createAudioPlayer();
      // An AudioPlayer will always emit an "error" event with a .resource property
      player.on('error', error => {
        console.error('Error:', error.message, 'with track', error.resource.metadata.title);
      });

      const resource = createAudioResource('/1.mp3', {
        metadata: {
          title: 'A good song!',
        },
      });
      player.play(resource);
    } catch (error) {
      console.log('cae aca error1 ', error);
      sendErrorMessage(error);
    }

  } catch (error) {
    console.log('cae aca error2 ', error)
    sendErrorMessage(error, message);
  }
}

function sendErrorMessage(error, message) {
  message.channel.send(`Dejando el canal de voz por el error: ${error}`).then(() => {
    executeQuit(message);
  }).catch(error => message.channel.send(`error ${error}`));
}

function executeQuit(message) {
  const botChannel = message.guild.me.voice.channel
  const connection = getVoiceConnection(botChannel.guild.id);
  connection.destroy();
}

function sendEmbedMessage(message, search) {
  if (message) {
    const messageEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Bot Cordobes buscando ${search}`)
      .setAuthor(`Bot Cordobes`, 'https://avatars.githubusercontent.com/u/80339238?v=4', 'https://github.com/Lautaroemurua/bot-discord')
      .addField('Arriba las palmiiitas', `Un saluditoo para ${message.author.tag.split('#')[0]} de corazon a corazon`, true)
      .setImage('https://c.tenor.com/QTN-F3swZfMAAAAM/mona-jimenez-mona.gif')
      .setTimestamp()
      .setFooter('Desarrollado por los pibes', 'https://i.imgur.com/AfFp7pu.png');
    message.channel.send({ embeds: [messageEmbed] });
  }
}

function executePlay(message, search) {

}


