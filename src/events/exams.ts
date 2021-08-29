/* eslint-disable linebreak-style */
import { SuccessMessageEmbed, WarningMessageEmbed } from '@/embeds';
import { getMessage, logger, keyv } from '@/utils';
import { Message } from 'discord.js';

import { sendMessage } from '@/extensions/telegram-bot';

function acceptRequest( acceptedMessage: Message ) {
  return acceptedMessage.reply(
    new SuccessMessageEmbed(
      {
        description: getMessage( 'command.exams.success' ),
      },
    ),
  );
}

function rejectRequest( rejectedMessage: Message ) {
  return rejectedMessage.reply(
    new WarningMessageEmbed(
      {
        description: getMessage( 'command.exams.not_allowed' ),
      },
    ),
  );
}

async function evaluate( message: Message ): Promise< boolean | undefined > {
  const examChannelId = await keyv( 'exams' ).get( 'channel_id' );

  if ( !examChannelId ) {
    logger.log( 'error', 'exam channelID is not set' );
    return undefined;
  }

  if ( message.channel.id === examChannelId ) {
    const pattern = /(höma|höhere|hö\sma|mathe)+/gi;
    const isRequestNotStupid = !( message.cleanContent.match( pattern ) );

    const deleteOptions = {
      timeout: 30000,
    };

    const replyMessage = isRequestNotStupid
      ? await acceptRequest( message ) : await rejectRequest( message );
    replyMessage.delete( deleteOptions );
    return isRequestNotStupid;
  }
  return undefined;
}

export default async function examHandler( message: Message ) {
  const result = await evaluate( message );
  if ( typeof result === 'undefined' ) {
    logger.error( 'Exam evaluation returned an unexpected error' );
    return;
  }
  if ( result ) {
    try {
      sendMessage( message );
      logger.info( 'A message has been send to Telegram feed' );
    } catch ( error ) {
      logger.error( `Sending message to Telegram Feed failed!\n' + ${error}` );
    }
    return;
  }
  logger.warn( 'An unnecessary request has been dropped' );
}
