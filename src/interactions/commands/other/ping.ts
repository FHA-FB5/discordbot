import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'ping',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(getMessage('command.other.ping.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'Pong!' });
  },
};