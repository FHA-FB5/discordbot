import { logger } from '@/utils';
import Keyv from 'keyv';
import Config from '@/Config';

export default function keyv(namespace: string, ttl: number | undefined = undefined) {
  const keyvObj = new Keyv(Config.keyvUri, { namespace, ttl });
  keyvObj.on('error', (err) => {
    logger.log('error', 'keyv error', err);
  });
  return keyvObj;
}
