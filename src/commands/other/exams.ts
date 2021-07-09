import { SuccessMessageEmbed, WarningMessageEmbed } from '@/embeds';
import { getMessage, logger } from '@/utils';
import { Message } from 'discord.js';

import { sendMessage } from '@/extensions/telegram-bot';

const deleteOptions = {
    timeout: 30000
}

function acceptRequest( message: Message ) {
    return message.reply( 
        new SuccessMessageEmbed( 
            { 
                description: getMessage( 'command.exams.success' ) 
            } ) );
}

function rejectRequest( message: Message ) {
    return message.reply(
        new WarningMessageEmbed(
            { 
                description: getMessage( 'command.exams.not_allowed' ) 
            } ) );
}

async function evaluate( message: Message ) {
    const isRequestNotStupid = !( message.cleanContent.match( /(höma|höhere|hö\sma|mathe)+/gi ) );
    const replyPromise = isRequestNotStupid ? acceptRequest( message ) : rejectRequest( message );
    const replyMessage = await Promise.resolve( replyPromise ); 
    replyMessage.delete( deleteOptions );
    return isRequestNotStupid;
}

export default {
    name: 'exams',
    guildOnly: true,
    cooldown: 0,
    async execute( message: Message ) {
        if ( await evaluate( message ) ) {
            sendMessage( message );
            logger.info( 'A message has been send to Telegram feed' );
        }
        logger.warn( 'An unnecessary request has been dropped' )
    }
}