import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'cookie',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('cookie')
    .setDescription(getMessage('command.other.cookie.description')),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: getMessage('command.other.cookie.success') });
  },
};