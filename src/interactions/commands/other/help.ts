import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { EmptyMessageEmbed } from '@/embeds';

export default {
  name: 'help',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(getMessage('command.other.help.description')),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ embeds: [new EmptyMessageEmbed({ 
      title: getMessage('command.other.help.title'),
      description: getMessage('command.other.help.text'), 
    })] });
  },
};