import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'mathemann',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('mathemann')
    .setDescription(getMessage('command.secret.mathemann.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'https://youtu.be/EVXfOATpgO0?t=68' });
  },
};