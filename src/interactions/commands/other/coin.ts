import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'coin',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription(getMessage('command.other.coin.description')),
  async execute(interaction: CommandInteraction) {
    var coin = 'Kopf';
    if (Math.round(Math.random())) {
      coin = 'Zahl';
    }
    await interaction.reply({ content: getMessage('command.other.coin.success', { parameter: { type: coin } }) });
  },
};