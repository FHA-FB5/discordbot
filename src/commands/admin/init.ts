import { SuccessMessageEmbed } from '@/embeds';
import { Guild } from '@/models';
import { getMessage, logger } from '@/utils';
import { Message } from 'discord.js';

export default {
  name: 'init',
  guildOnly: true,
  cooldown: 300000,
  permissions: ['ADMINISTRATOR'],
  execute(message: Message) {
    if (message.guild) {
      Guild.findOneAndUpdate({ guildId: message.guild.id }, {
        guildId: message.guild.id,
        primaryLocale: message.guild.preferredLocale,
      }, {
        upsert: true,
        setDefaultsOnInsert: true,
      }, (err) => {
        logger.log('error', 'command.admin.init guild.findOneAndUpdate', err);
      });

      message.reply(new SuccessMessageEmbed({ description: getMessage('command.admin.init.success') }));
    }
  },
};
