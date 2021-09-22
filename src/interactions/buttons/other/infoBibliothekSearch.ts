import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.bib.search',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('Bibliothek-Suche')
    .setURL('https://fhb-aachen.digibib.net/search/katalog')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};