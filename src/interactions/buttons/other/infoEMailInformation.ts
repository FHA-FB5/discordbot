import { MessageButton } from 'discord.js';

export default {
  customId: 'other.info.email.information',
  cooldown: 10000,
  defaultPermission: false,
  data: new MessageButton()
    .setLabel('E-Mail Informationen')
    .setURL('https://www.fh-aachen.de/hochschule/datenverarbeitungszentrale/kommunikationsdienste/e-mail')
    .setStyle('LINK'),
  async execute() {
    //is link button -> nothing to do here
  },
};