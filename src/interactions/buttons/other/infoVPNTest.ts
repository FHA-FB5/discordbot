import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.vpn.test',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('VPN-Test')
    .setURL('https://tools.fh-aachen.de/vpntest/')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};