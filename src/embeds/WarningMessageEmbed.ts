import { getMessage } from '@/utils';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import EmptyMessageEmbed from './EmptyMessageEmbed';

export default class WarningMessageEmbed extends EmptyMessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setColor('#f1c40f')
      .setTitle(getMessage('embed.warning.title'));
  }
}
