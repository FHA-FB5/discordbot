/* eslint-disable linebreak-style */
import { Message } from 'discord.js';
import { WarningMessageEmbed } from '@/embeds';
import { getMessage, logger, keyv } from '@/utils';

export default {
  name: 'init-exam-channel',
  guildOnly: true,
  cooldown: 0,
  permissions: [ 'ADMINISTRATOR' ],
  execute( message: Message ) {
    const channelId = message.content.split( ' ' )[1];
    const examChannel = message.guild?.channels.cache.get( channelId );

    function isInvalid() {
      return !( channelId && examChannel );
    }

    if ( isInvalid() ) {
      message.reply(
        new WarningMessageEmbed(
          {
            description: getMessage( 'command.exams.invalid' ) + message.content,
          },
        ),
      );
      logger.warn( `Invalid Channel ID: "${message.content}" provided` );
      return;
    }
    const key = keyv( 'exams' );
    key.set( 'channel_id', channelId );
    logger.info( `New Exam Channel ID: "${channelId}" have been persisted` );
  },
};
