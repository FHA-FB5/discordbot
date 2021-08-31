import { ButtonInteraction, CommandInteraction, MessageComponentInteraction, SelectMenuInteraction } from 'discord.js';
import { logger } from '@/utils';

async function interactionButton(interaction: ButtonInteraction) {
  const button = interaction.client.buttons.get(interaction.customId);

  if (!button) return;

  try {
    await button.execute(interaction);
  } catch (error) {
    logger.log('error', 'discord interactionCreate button.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
  }
}

async function interactionCommand(interaction: CommandInteraction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.log('error', 'discord interactionCreate command.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
}

async function interactionSelectMenu(interaction: SelectMenuInteraction) {
  const selectMenu = interaction.client.selectMenus.get(interaction.customId);

  if (!selectMenu) return;

  try {
    await selectMenu.execute(interaction);
  } catch (error) {
    logger.log('error', 'discord interactionCreate selectMenu.execute.error', error);
    await interaction.reply({ content: 'There was an error while executing this selectMenu!', ephemeral: true });
  }
}
export default {
  name: 'interactionCreate',
  async execute(interaction: MessageComponentInteraction) {
    if (interaction.isCommand()) {
      await interactionCommand(interaction);
    } else if (interaction.isButton()) {
      await interactionButton(interaction);
    } else if (interaction.isSelectMenu()) {
      await interactionSelectMenu(interaction);
    } else {
      logger.log('warn', 'discord interactionCreate.unknown', interaction);
    }
  },
};
