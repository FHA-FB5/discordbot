import { ShardingManager } from 'discord.js';
import environment from './environment';
import { logger } from './utils';

const shardingManager = new ShardingManager(`${__dirname}/bot.js`, { token: environment.bot_token, totalShards: 'auto', shardList: [environment.shard] });

shardingManager.on('shardCreate', async () => {
  logger.log('info', 'shardingManager shardCreate');
});
shardingManager.spawn();
