import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'mathe-ist-toll',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('mathe-ist-toll')
    .setDescription(getMessage('command.secret.matheIstToll.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: getMessage('command.secret.matheIstToll.success') });
  },
};