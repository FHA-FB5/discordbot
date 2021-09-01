import { ShardingManager } from 'discord.js';
import { logger } from './utils';
import Config from '@/Config';

const shardingManager = new ShardingManager(`${__dirname}/bot.js`, {
  token: Config.botToken,
  totalShards: 'auto',
  shardList: [
    Config.botShard,
  ],
});

shardingManager.on('shardCreate', async () => {
  logger.log('info', 'shardingManager shardCreate');
});
shardingManager.spawn();
