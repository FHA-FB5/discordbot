import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.video.link',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('Video')
    .setURL('https://video.fh-aachen.de/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};