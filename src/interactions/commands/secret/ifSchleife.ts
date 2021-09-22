import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'if-schleife',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('if-schleife')
    .setDescription(getMessage('command.secret.ifSchleife.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'http://if-schleife.de/' });
  },
};