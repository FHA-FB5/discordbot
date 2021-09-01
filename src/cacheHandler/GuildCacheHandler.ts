import AbstractCacheHandler from '@/cacheHandler/AbstractCacheHandler';
import { Guild } from '@/models';


export default class GuildCacheHandler extends AbstractCacheHandler {

  model = Guild;

  identifier = 'guildId';

  namespace = 'guilds';

  cacheTtl: number = 600000;
}