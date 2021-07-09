import { Message } from "discord.js";
import { keyv } from "@/utils";

const TelegramBot = require( 'node-telegram-bot-api' );

const token = process.env.TELEGRAM_BOT_TOKEN;

const botConfig = {
    polling: true
}

export const bot = new TelegramBot( token, botConfig );

export async function sendMessage( msg: Message ) {
    const channelId = keyv( 'exams' ).get( 'channel_id' );
    const completeMessage = 'Eine neue Anfrage wurde auf dem Discord Server registriert:\n\n' + msg;
    bot.sendMessage( channelId, completeMessage );
}
