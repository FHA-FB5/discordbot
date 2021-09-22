import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'error',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('error')
    .setDescription(getMessage('command.secret.error.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: getMessage('command.secret.error.success') });
  },
};