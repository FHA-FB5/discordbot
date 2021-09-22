import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.vpn.information',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('VPN Informationen')
    .setURL('https://www.fh-aachen.de/hochschule/datenverarbeitungszentrale/netzanbindung/vpn')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};