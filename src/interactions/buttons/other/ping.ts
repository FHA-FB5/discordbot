import { ButtonInteraction, MessageButton } from 'discord.js';

export default {
  customId: 'other.ping',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setCustomId('other.ping')
    .setLabel('Ping')
    .setStyle('PRIMARY'),
  async execute(interaction: ButtonInteraction) {
    await interaction.reply({ content: 'Pong!' });
  },
};