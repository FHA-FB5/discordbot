/* eslint-disable no-console */
import { Guild } from 'discord.js';

export default {
  name: 'guildCreate',
  execute(guild: Guild) {
    console.log('test');
  },
};
