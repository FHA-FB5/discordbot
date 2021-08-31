import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'dev-init',
  dev: true,
  data: new SlashCommandBuilder()
    .setName('dev-init')
    .setDescription(getMessage('command.dev.devInit.description', {
      parameter: {
        ping: 'Ping :D',
      },
    })),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: 'Dev-init!?',
    });
  },
};