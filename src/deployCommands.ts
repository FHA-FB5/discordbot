import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { logger } from '@/utils';
import { readdirSync } from 'fs';
import Config from '@/Config';

const commands = [];
const commandFolders = readdirSync(`${__dirname}/interactions/commands`);
// eslint-disable-next-line no-restricted-syntax
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`${__dirname}/interactions/commands/${folder}`).filter((file) => file.endsWith('.js'));
  // eslint-disable-next-line no-restricted-syntax
  for (const file of commandFiles) {
    // eslint-disable-next-line global-require
    const command = require(`./interactions/commands/${folder}/${file}`);
    logger.log('info', 'deployCommands.load.command', { module: folder, command: command.default.name });

    if (Config.devMode || !command.default.dev) {
      commands.push(command.default.data.toJSON());
    } else {
      logger.log('info', 'deployCommands.ignore.command.dev', { module: folder, command: command.default.name });
    }
  }
}

const rest = new REST({ version: '9' }).setToken(Config.botToken);
(async () => {
  try {
    if (Config.devMode) {
      if (Config.devGuildId) {
        await rest.put(
          Routes.applicationGuildCommands(Config.botClientID, Config.devGuildId),
          { body: commands },
        );
        logger.log('info', 'discord application.guildCommand.register successfully', { command: commands });
      } else {
        logger.log('error', 'discord application.guildCommand.register Config.devGuildId missing', { command: commands });
      }
    } else {
      await rest.put(
        Routes.applicationCommands(Config.botClientID),
        { body: commands },
      );
      logger.log('info', 'discord application.command.register successfully', { command: commands });
    }
  } catch (error) {
    logger.log('error', 'discord application.command.register error', error);
  }
})();