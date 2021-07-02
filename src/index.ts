import { ShardingManager } from 'discord.js';
import environment from './environment';
import { logger } from './utils';

const shardingManager = new ShardingManager(`${__dirname}/bot.js`, { token: environment.bot_token, totalShards: 1, shardList: [environment.shard] });

shardingManager.on('shardCreate', (shard) => logger.log('info', 'shardingManager shardCreate', shard));
shardingManager.spawn();
