import AbstractCacheHandler from '@/cacheHandler/AbstractCacheHandler';
import { User } from '@/models';


export default class UserCacheHandler extends AbstractCacheHandler {

  model = User;

  identifier = 'userId';

  namespace = 'users';

  cacheTtl: number = 60000;
}