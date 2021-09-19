import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { logger } from '@/utils';
import { readdirSync, writeFile } from 'fs';
import Config from '@/Config';

const commands = [];
const commandsData: any = {};
const commandsOwnerHasPermissionOnDefault: string[] = [];
const commandsOwnerHasPermissionOnDefaultIDs: string[] = [];
const commandFolders = readdirSync(`${__dirname}/interactions/commands`);
// eslint-disable-next-line no-restricted-syntax
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`${__dirname}/interactions/commands/${folder}`).filter((file) => file.endsWith('.js'));
  // eslint-disable-next-line no-restricted-syntax
  for (const file of commandFiles) {
    // eslint-disable-next-line global-require
    const command = require(`./interactions/commands/${folder}/${file}`);
    logger.log('info', 'deployCommands.load.command', { module: folder, command: command.default.name });

    if (command.default.ownerHasPermissionOnDefault) {
      commandsOwnerHasPermissionOnDefault.push(command.default.name);
    }

    if (Config.devMode || !command.default.dev) {
      commands.push(command.default.data.toJSON());
    } else {
      logger.log('info', 'deployCommands.ignore.command.dev', { module: folder, command: command.default.name });
    }
  }
}

const rest = new REST({ version: '9' }).setToken(Config.botToken);
(async () => {
  let output;
  try {
    if (Config.devMode) {
      if (Config.devGuildId) {
        output = await rest.put(
          Routes.applicationGuildCommands(Config.botClientID, Config.devGuildId),
          { body: commands },
        );
        logger.log('info', 'discord application.guildCommand.register successfully', { command: commands });
      } else {
        logger.log('error', 'discord application.guildCommand.register Config.devGuildId missing', { command: commands });
      }
    } else {
      output = await rest.put(
        Routes.applicationCommands(Config.botClientID),
        { body: commands },
      );
      logger.log('info', 'discord application.command.register successfully', { command: commands });
    }
  } catch (error) {
    logger.log('error', 'discord application.command.register error', error);
  }
  if (output) {
    JSON.parse(JSON.stringify(output)).forEach((command: any) => {
      commandsData[command.name] = {
        id: command.id,
        name: command.name,
      };

      if (commandsOwnerHasPermissionOnDefault && commandsOwnerHasPermissionOnDefault.includes(command.name)) {
        commandsOwnerHasPermissionOnDefaultIDs.push(command.id);
      }
    });
  }
  writeFile('./commandsData.json', JSON.stringify(commandsData), 'utf8', function (error) {
    if (error) {
      logger.log('error', 'discord application.command.write.commandsData error', error);
      return;
    }
    logger.log('info', 'discord application.command.write.commandsData successfully');
  });
  writeFile('./commandsOwnerHasPermissionOnDefaultIDs.json', JSON.stringify(commandsOwnerHasPermissionOnDefaultIDs), 'utf8', function (error) {
    if (error) {
      logger.log('error', 'discord application.command.write.commandsOwnerHasPermissionOnDefaultIDs error', error);
      return;
    }
    logger.log('info', 'discord application.command.write.commandsOwnerHasPermissionOnDefaultIDs successfully');
  });
})();