import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getMessage } from '@/utils';

export default {
  name: 'mayonnaise',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('mayonnaise')
    .setDescription(getMessage('command.secret.mayonnaise.description')),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'https://www.youtube.com/watch?v=hVtSkF-hBXE' });
  },
};