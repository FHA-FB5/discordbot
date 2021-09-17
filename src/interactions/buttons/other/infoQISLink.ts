import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.qis.link',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    //.setCustomId('other.info.fsr.website')
    .setLabel('QIS')
    .setURL('https://qis.fh-aachen.de')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};