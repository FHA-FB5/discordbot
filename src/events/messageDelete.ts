import {
  Client, Message, MessageEmbed, TextChannel, User,
} from 'discord.js';
import KafkaProducer from '@/utils/KafkaProducer';

export default {
  name: 'messageDelete',
  async execute(message: Message, client: Client) {
    console.log(message);
    // embed
    const logChannel = client.channels.cache.get('821399725458587799') as TextChannel;
    const infoEmbed = new MessageEmbed()
      .setColor('#38bded')
      .setTitle('Message deleted')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .addFields(
        { name: 'Author:', value: `${message.author} (${message.author.id})` },
        { name: 'Channel:', value: `${message.channel} (${message.channel.id})` },
        { name: 'Message ID:', value: `${message.id}` },
      )
      .setTimestamp();

    // check if guild message
    let auditLog;
    if (message.guild) {
      // try fetch audio log
      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
      });
      const fetchedLog = fetchedLogs.entries.first();

      // check if fetched
      if (fetchedLog) {
        const extra: any = fetchedLog?.extra;
        if (extra) {
          const target = fetchedLog.target as User;
          const channel = extra.channel as TextChannel;

          if (target.id === message.author.id
            && channel.id === message.channel.id
            && fetchedLog.createdTimestamp >= (Date.now() - 5000)
            && extra.count >= 1) {
            infoEmbed.addFields(
              { name: 'Message probably deleted by:', value: `${fetchedLog.executor} (${fetchedLog.executor?.id})` },
            );
          }

          auditLog = fetchedLog;
        }
      }
    }

    // embed
    infoEmbed.addFields(
      { name: 'Message created timestamp:', value: new Date(message.createdTimestamp).toISOString() },
    );

    if (message.content) infoEmbed.addField('Message content:', message.content);

    message.attachments.forEach((attachment) => {
      //infoEmbed.addField('Message attachment:', attachment.attachment);
      infoEmbed.addField('Message attachment URL:', attachment.url);
      infoEmbed.addField('Message attachment Proxy-URL:', attachment.proxyURL);
      infoEmbed.setImage(attachment.attachment.toString());
    });

    logChannel.send({
      embeds: [infoEmbed],
    });

    // send message to kafka
    new KafkaProducer('message', Buffer.from(JSON.stringify(
      {
        action: 'delete',
        object: message.toJSON(),
        auditLog,
      },
    )), message.id).connect();
  },
};
