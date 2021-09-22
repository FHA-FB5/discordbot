import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'mathe-ist-magic',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('mathe-ist-magic')
    .setDescription(getMessage('command.secret.matheIstMagic.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: getMessage('command.secret.matheIstMagic.success') });
  },
};