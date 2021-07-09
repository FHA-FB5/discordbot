import environment from '@/environment';
import { Message } from "discord.js";

const TelegramBot = require( 'node-telegram-bot-api' );

const botConfig = {
    polling: true
}

const bot = new TelegramBot( environment.telegram_bot_token, botConfig );

async function sendMessage( msg: Message ) {
    const completeMessage = 'Eine neue Anfrage wurde auf dem Discord Server registriert:\n\n' + msg.cleanContent;
    bot.sendMessage( environment.telegram_feed_id, completeMessage );
}

export {
    sendMessage
}
