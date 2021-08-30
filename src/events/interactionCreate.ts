import { Client, CommandInteraction } from 'discord.js';
import { logger } from '@/utils';

export default {
  name: 'interactionCreate',
  async execute(interaction: CommandInteraction, client: Client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.log('error', 'discord interactionCreate command.execute.error', error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};
