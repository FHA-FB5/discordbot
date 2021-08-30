import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import environment from '@/environment';
import { logger } from '@/utils';
import { readdirSync } from 'fs';

const commands = [];
const commandFolders = readdirSync(`${__dirname}/commands`);
// eslint-disable-next-line no-restricted-syntax
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`${__dirname}/commands/${folder}`).filter((file) => file.endsWith('.js'));
  // eslint-disable-next-line no-restricted-syntax
  for (const file of commandFiles) {
    // eslint-disable-next-line global-require
    const command = require(`./commands/${folder}/${file}`);
    logger.log('info', 'deployCommands.load.command', { module: folder, command: command.default.name });
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(environment.bot_token);
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(environment.bot_client_id, environment.dev_guild_id),
      { body: commands },
    );
    logger.log('info', 'discord application.command.register successfully', { command: commands });
  } catch (error) {
    logger.log('error', 'discord application.command.register error', error);
  }
})();