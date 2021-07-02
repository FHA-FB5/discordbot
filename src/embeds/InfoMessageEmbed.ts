import { getMessage } from '@/utils';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import EmptyMessageEmbed from './EmptyMessageEmbed';

export default class InfoMessageEmbed extends EmptyMessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setColor('#3498db')
      .setTitle(getMessage('embed.info.title'));
  }
}
