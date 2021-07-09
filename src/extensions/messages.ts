import { Message } from "discord.js";

async function exchangeUrl( message: Message ) {
    message.edit( message.content.replace( /fsr5.com|fsr.com|fsr.de/g, 'fsr5.de' ) );
}

export {
    exchangeUrl
}
