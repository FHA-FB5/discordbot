import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'image-movie',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('image-movie')
    .setDescription(getMessage('command.other.imageMovie.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'https://www.youtube.com/watch?v=dvqUcB_3JPg' });
  },
};