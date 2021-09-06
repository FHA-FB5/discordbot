/* eslint-disable linebreak-style */
import { Message } from 'discord.js';
import { SuccessMessageEmbed, WarningMessageEmbed, ErrorMessageEmbed } from '@/embeds';
import { getMessage, logger, keyv } from '@/utils';

import TelegramBot from '@/extensions/telegram-bot';

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

function sendErrorEmbed( message: Message ) {
  return message.reply(
    new ErrorMessageEmbed(
      {
        description: getMessage( 'command.exams.send_error' ),
      },
    ),
  );
}

const deleteOptions = {
  timeout: 30000,
};

async function evaluate( message: Message ): Promise< boolean | undefined | null > {
  const examChannelId = await keyv( 'exams' ).get( 'channel_id' );

  if ( !examChannelId ) {
    logger.log( 'error', 'exam channelID is not set' );
    return undefined;
  }

  if ( message.channel.id === examChannelId ) {
    const pattern = /(höma|höhere|hö\sma|mathe)+/gi;
    const isRequestNotStupid = !( message.cleanContent.match( pattern ) );

    const replyMessage = isRequestNotStupid
      ? await acceptRequest( message ) : await rejectRequest( message );
    replyMessage.delete( deleteOptions );
    return isRequestNotStupid;
  }
  return null;
}

export default async function examHandler( message: Message ) {
  const result = await evaluate( message );
  if ( typeof result === 'undefined' ) {
    logger.error( 'Message evaluation for exams returned an unexpected error' );
    return;
  }
  if ( result === null ) {
    // message was sent in different channel 
    return;
  }
  if ( result ) {
    try {
      const returnCode = await TelegramBot.sendMessage( message );
      let errorMessage;
      switch ( returnCode ) {
        case -1:
          errorMessage = await sendErrorEmbed( message );
          errorMessage.delete( deleteOptions );
          break;
        case -2:
          message.react( '🔇' );
          logger.info( 'Sending message to the Telegram API has been dropped intentionally' );
          break;
        default:
          logger.info( 'A message has been send to Telegram feed' );
      }
    } catch ( error ) {
      logger.error( `Sending message to Telegram Feed failed!\n' + ${error}` );
    }
    return;
  }
  logger.warn( 'An unnecessary request has been dropped' );
}
