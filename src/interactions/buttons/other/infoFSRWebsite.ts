import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.fsr.website',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('FSR-Website')
    .setURL('https://fsr5.de/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};