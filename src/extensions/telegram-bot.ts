/* eslint-disable linebreak-style */
import { Message } from 'discord.js';
import environment from '@/environment';
import { logger } from '@/utils';

const TelegramBot = require( 'node-telegram-bot-api' );

const botConfig = {
  polling: true,
};

const bot = new TelegramBot( environment.telegram_bot_token, botConfig );

async function sendMessage( msg: Message ): Promise< number > {
  // there is no i18n usage here because of only german recipients
  const formattedDate = msg.createdAt
    .toLocaleString(
      'de-DE',
      // creating a seperate object and assign it as param somehow doesn't work
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  const channelName = msg.guild?.channels.cache.get( msg.channel.id )?.name;
  const completeMessage = `Eine neue Anfrage wurde auf dem Discord Server im "${channelName}"-Channel registriert:\n\n`
    + `Nickname: ${msg.author.username}\nUser: ${msg.author.tag}\nID: ${msg.author.id}\nZeitstempel: ${formattedDate} Uhr\n\n`
    + `Nachricht (${msg.id}):\n\n"${msg.cleanContent}"\n\n`
    + `Folge dem Link, um direkt zur Nachricht zu gelangen:\n${msg.url}`;
  try {
    bot.sendMessage(
      environment.telegram_feed_id,
      completeMessage,
      {
        disable_web_page_preview: true,
      },
    );
  } catch ( error ) {
    logger.error( `Sending message to the Telegram API failed:\n"${error}"` );

    return -1;
  }
  return 0;
}

export default {
  sendMessage,
};
