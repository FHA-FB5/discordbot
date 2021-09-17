import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { InfoMessageEmbed, ErrorMessageEmbed } from '@/embeds';

export default {
  name: 'bot-info',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription(getMessage('command.admin.botinfo.description'))
    .addStringOption(option => 
      option.setName('action')
        .setDescription(getMessage('command.admin.botinfo.action.description'))
        .setRequired(true)
        .addChoice('ping', 'ping')),
  async execute(interaction: CommandInteraction) {
    switch (interaction.options.getString('action')) {
      case 'ping':
        await interaction.reply({ embeds: [new InfoMessageEmbed({ description: getMessage('command.admin.botinfo.action.ping.success', { parameter: { ping: interaction.client.ws.ping } }) })] });
        break;
      default:
        await interaction.reply({ embeds: [new ErrorMessageEmbed({ description: getMessage('error.unknown') })] });
        break;
    }
  },
};