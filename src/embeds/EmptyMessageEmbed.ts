import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export default class EmptyMessageEmbed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setTimestamp();
  }
}
