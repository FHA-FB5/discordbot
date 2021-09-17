import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.services.link',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('Services')
    .setURL('https://services.fh-aachen.de/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};