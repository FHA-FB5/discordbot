import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { EmptyMessageEmbed } from '@/embeds';

export default {
  name: 'quartus',
  cooldown: 10000,
  data: new SlashCommandBuilder()
    .setName('quartus')
    .setDescription(getMessage('command.other.quartus.description'))
    .setDefaultPermission(true),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ embeds: [new EmptyMessageEmbed({ 
      title: getMessage('command.other.quartus.title'),
      description: getMessage('command.other.quartus.text'), 
    })] });
  },
};