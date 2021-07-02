import { getMessage } from '@/utils';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import EmptyMessageEmbed from './EmptyMessageEmbed';

export default class ErrorMessageEmbed extends EmptyMessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setColor('#e74c3c')
      .setTitle(getMessage('embed.error.title'));
  }
}
