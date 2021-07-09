import { SuccessMessageEmbed, WarningMessageEmbed } from '@/embeds';
import { getMessage, logger, keyv } from '@/utils';
import { Message } from 'discord.js';

import { sendMessage } from '@/extensions/telegram-bot';

async function evaluate( message: Message ) {
    const isRequestNotStupid = !( message.cleanContent.match( /(höma|höhere|hö\sma|mathe)+/gi ) );

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

    const replyPromise = isRequestNotStupid ? acceptRequest( message ) : rejectRequest( message );
    const replyMessage = await Promise.resolve( replyPromise ); 
    replyMessage.delete( deleteOptions );
    return isRequestNotStupid;
}

export default {
    name: 'exams',
    guildOnly: true,
    cooldown: 0,
    permissions: [ 'SEND_MESSAGES' ],
    aliases: [ 'exam', 'klausur', 'klausuren', 'altklausuren', 'ak' ],
    async execute( message: Message ) {
        const examChannelId = await keyv( 'exams' ).get( 'channel_id' );
        if ( message.channel.id !== examChannelId ) {
            return;
        }

        if ( await evaluate( message ) ) {
            try {
                sendMessage( message );
                logger.info( 'A message has been send to Telegram feed' );
            }
            catch ( error ) {
                logger.error( 'Sending message to Telegram Feed failed!\n' + error );
            }
        }
        logger.warn( 'An unnecessary request has been dropped' )
    }
}
