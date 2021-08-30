import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'ping',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(getMessage('command.other.ping.description')),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!');
  },
};