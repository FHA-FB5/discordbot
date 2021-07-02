import { Client, Message } from 'discord.js';

export default {
  name: 'ping',
  args: true,
  usage: '<user> <role>',
  guildOnly: true,
  cooldown: 5000,
  aliases: ['pong'],
  permissions: ['KICK_MEMBERS'],
  execute(message: Message, client: Client) {
    message.channel.send('Pong!');
    console.log(JSON.stringify(client.shard));
  },
};
