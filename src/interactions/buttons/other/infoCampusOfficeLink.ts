import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.campusoffice.link',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('CampusOffice')
    .setURL('https://campusoffice.fh-aachen.de/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};