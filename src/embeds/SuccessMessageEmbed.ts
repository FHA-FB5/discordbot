import { getMessage } from '@/utils';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import EmptyMessageEmbed from './EmptyMessageEmbed';

export default class SuccessMessageEmbed extends EmptyMessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setColor('#2ecc71')
      .setTitle(getMessage('embed.success.title'));
  }
}
