import { Client, Collection, Intents } from 'discord.js';
import environment from '@/environment';
import { readdirSync } from 'fs';
import { logger, i18n } from '@/utils';

require('dotenv').config();
require('@/connections/mongoDB');

// setup client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
client.i18n = i18n;

// events
const eventFiles = readdirSync(`${__dirname}/events/`).filter((file) => file.endsWith('.js'));

//eslint-disable-next-line no-restricted-syntax
for (const file of eventFiles) {
  // eslint-disable-next-line global-require
  const event = require(`./events/${file}`);
  logger.log('info', 'load event', { event: event.default.name });
  if (event.default.once) {
    client.once(event.default.name, (...args) => {
      event.default.execute(...args, client);
    });
  } else {
    client.on(event.default.name, (...args) => {
      event.default.execute(...args, client);
    });
  }
}

// setup commands
client.commands = new Collection();

const commandFolders = readdirSync(`${__dirname}/commands`);
// eslint-disable-next-line no-restricted-syntax
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`${__dirname}/commands/${folder}`).filter((file) => file.endsWith('.js'));
  // eslint-disable-next-line no-restricted-syntax
  for (const file of commandFiles) {
    // eslint-disable-next-line global-require
    const command = require(`./commands/${folder}/${file}`);
    logger.log('info', 'load command', { module: folder, command: command.default.name });
    client.commands.set(command.default.name, command.default);
  }
}

// login client
logger.log('info', 'client login');
client.login(
  environment.bot_token,
);
