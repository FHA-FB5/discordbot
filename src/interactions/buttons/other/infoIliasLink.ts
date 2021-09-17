import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.ilias.link',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('Ilias')
    .setURL('https://www.ili.fh-aachen.de/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};