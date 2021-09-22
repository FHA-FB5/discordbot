import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.testat.link',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('Testatverwaltung')
    .setURL('https://www.testat.etechnik.fh-aachen.de/student_login.php')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};