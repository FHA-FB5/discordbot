import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';
import { EmptyMessageEmbed } from '@/embeds';

export default {
  name: 'visual-studio',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('visual-studio')
    .setDescription(getMessage('command.other.visualStudio.description')),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ embeds: [new EmptyMessageEmbed({ 
      title: getMessage('command.other.visualStudio.title'),
      description: getMessage('command.other.visualStudio.text'), 
    })] });
  },
};