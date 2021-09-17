import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'hoever',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('hoever')
    .setDescription(getMessage('command.secret.hoever.description')),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'https://soundcloud.com/cvrofficial/hoever/s-eXVFz' });
  },
};