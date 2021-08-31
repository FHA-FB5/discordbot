import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow } from 'discord.js';
import { getMessage } from '@/utils';
import * as pingButton from '@/interactions/buttons/other/ping';

export default {
  name: 'ping',
  cooldown: 10000,
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(getMessage('command.other.ping.description')),
  async execute(interaction: CommandInteraction) {
    const buttonRow = new MessageActionRow()
      .addComponents(
        pingButton.default.data,
      );

    await interaction.reply({
      content: 'Pong!', components: [
        buttonRow,
      ],
    });
  },
};