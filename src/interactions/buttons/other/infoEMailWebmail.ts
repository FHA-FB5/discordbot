import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.email.webmail',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('Webmail')
    .setURL('https://mail.fh-aachen.de/owa/auth/logon.aspx')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};