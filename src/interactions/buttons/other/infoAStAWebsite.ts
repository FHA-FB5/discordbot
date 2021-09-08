import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.asta.website',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('AStA-Website')
    .setURL('https://asta.fh-aachen.org/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};