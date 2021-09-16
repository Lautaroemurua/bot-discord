const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Bot ${client.user.tag} listo!`);
    client.user.setStatus('dnd');
});

client.on('message', message => {

  if (message.content.includes(`/`)) {
    message.reply(`Comandos mas alla del deber ${message.author}.`)
  }

  if (message.content === '/Comandos') {
    message.reply(`Comandos.`)
  }
})

client.login('ODg4MTM1MDkzNjI4MDcxOTM2.YUOSQw.jU1k6A5T17oy0ubXgDbVJubZz_4');