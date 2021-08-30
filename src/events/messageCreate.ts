// import { ErrorMessageEmbed, InfoMessageEmbed } from '@/embeds';
// import environment from '@/environment';
// import {
//   getMessage, GuildOptions, keyv, logger,
// } from '@/utils';
import { Message } from 'discord.js';
import { logger } from '@/utils';

// async function commandHandler(message: Message, client: Client) {
//   // get option
//   const options = {
//     prefix: environment.bot_prefix,
//     locale: 'en-GB',
//   };

//   // check guild options
//   if (message.guild) {
//     const guildOptions = await new GuildOptions(message.guild.id).get();

//     if (guildOptions) {
//       // check prefix
//       if (guildOptions.prefix) {
//         options.prefix = guildOptions.prefix;
//       }

//       // check local
//       if (guildOptions.locale) {
//         options.locale = guildOptions.locale;
//       }
//     }
//   }

//   if (!message.content.startsWith(options.prefix)) return;

//   // parse message
//   const args = message.content.slice(options.prefix.length).trim().split(/ +/);
//   const commandName = args.shift()?.toLowerCase();

//   // tries to find the command by name or alias and aborts if none is found
//   const command = client.commands.get(commandName)
//     || client.commands.find((cmd: any) => cmd.aliases && cmd.aliases.includes(commandName));
//   if (!command) return;

//   // check permissions
//   if (command.permissions && !message.member?.permissions.has(command.permissions)) {
//     return;
//   }

//   // check coolodown and cooldown response
//   if (command.cooldown) {
//     const cooldowns = keyv('cooldowns');
//     const cooldownResponses = keyv('cooldownResponses');

//     const now = Date.now();
//     const cooldownTimestamp = await cooldowns.get(`${message.author.id}:${command.name}`);
//     if (cooldownTimestamp) {
//       const cooldownExpirationTime = cooldownTimestamp + command.cooldown;
//       const cooldownResponseTimestamp = await cooldownResponses.get(`${message.author.id}:${command.name}`);

//       // return if cooldown response is on cooldown
//       if (cooldownResponseTimestamp) {
//         return;
//       }

//       if (now < cooldownExpirationTime) {
//         message.reply({
//           embeds: [new InfoMessageEmbed({ description: getMessage('command.cooldown', { count: Math.floor((cooldownExpirationTime - now) / 1000), locale: options.locale }) })],
//         });

//         // set cooldown for cooldown response
//         let cooldownResponseIgnoreTimestamp = command.cooldown * 0.2;
//         if (cooldownResponseIgnoreTimestamp < 5000) {
//           cooldownResponseIgnoreTimestamp = 5000;
//         }
//         await cooldownResponses.set(`${message.author.id}:${command.name}`, now, cooldownResponseIgnoreTimestamp);
//         return;
//       }
//     }
//     await cooldowns.set(`${message.author.id}:${command.name}`, now, command.cooldown);
//   }

//   // check if command is guild only
//   if (command.guildOnly && message.channel.type === 'DM') {
//     message.reply('I can\'t execute that command inside DMs!');
//     return;
//   }

//   // check if arguments are set
//   if (command.args && !args.length) {
//     let reply = `You didn't provide any arguments, ${message.author}!`;

//     // add usage to reply when set
//     if (command.usage) {
//       reply += `\nThe proper usage would be: \`${command.name} ${command.usage}\``;
//     }
//     message.channel.send(reply);
//     return;
//   }

//   // try to execute command
//   try {
//     command.execute(message, client, args);
//   } catch (error) {
//     logger.log('error', 'discord event.message command.error', error);
//     message.reply({
//       embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown', { locale: options.locale }) })],
//     });
//   }
// }

export default {
  name: 'messageCreate',
  async execute(message: Message) {
    //console.log(message);
    logger.log('info', 'discord event.messageCreate');
    // if (!message.author.bot) {
    //   await commandHandler(message, client);
    // }
  },
};
