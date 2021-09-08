import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { logger, i18n } from '@/utils';
import Config from '@/Config';

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

try {
  const commandFolders = readdirSync(`${__dirname}/interactions/commands`);
  // eslint-disable-next-line no-restricted-syntax
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(`${__dirname}/interactions/commands/${folder}`).filter((file) => file.endsWith('.js'));
    // eslint-disable-next-line no-restricted-syntax
    for (const file of commandFiles) {
      // eslint-disable-next-line global-require
      const command = require(`./interactions/commands/${folder}/${file}`);
      logger.log('info', 'load command', { module: folder, command: command.default.name });
      client.commands.set(command.default.name, command.default);
    }
  }
} catch (error) {
  logger.log('error', 'load command', { error });
}

// setup buttons
client.buttons = new Collection();

try {
  const buttonFolders = readdirSync(`${__dirname}/interactions/buttons`);
  // eslint-disable-next-line no-restricted-syntax
  for (const folder of buttonFolders) {
    const buttonFiles = readdirSync(`${__dirname}/interactions/buttons/${folder}`).filter((file) => file.endsWith('.js'));
    // eslint-disable-next-line no-restricted-syntax
    for (const file of buttonFiles) {
      // eslint-disable-next-line global-require
      const button = require(`./interactions/buttons/${folder}/${file}`);
      logger.log('info', 'load button', { module: folder, button: button.default.customId });
      client.buttons.set(button.default.customId, button.default);
    }
  }
} catch (error) {
  logger.log('error', 'load buttons', { error });
}

// setup selectMenus
client.selectMenus = new Collection();

try {
  const selectMenuFolders = readdirSync(`${__dirname}/interactions/selectMenus`);
  // eslint-disable-next-line no-restricted-syntax
  for (const folder of selectMenuFolders) {
    const selectMenuFiles = readdirSync(`${__dirname}/interactions/selectMenus/${folder}`).filter((file) => file.endsWith('.js'));
    // eslint-disable-next-line no-restricted-syntax
    for (const file of selectMenuFiles) {
      // eslint-disable-next-line global-require
      const selectMenu = require(`./interactions/selectMenus/${folder}/${file}`);
      logger.log('info', 'load selectMenu', { module: folder, button: selectMenu.default.customId });
      client.selectMenus.set(selectMenu.default.customId, selectMenu.default);
    }
  }
} catch (error) {
  logger.log('error', 'load selectMenus', { error });
}

// login client
logger.log('info', 'client login');
client.login(
  Config.botToken,
);
