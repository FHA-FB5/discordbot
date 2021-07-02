import environment from '@/environment';
import { logger } from '@/utils';
import Keyv from 'keyv';

export default function keyv(namespace: string, ttl: number | undefined = undefined) {
  const keyvObj = new Keyv(environment.keyv_uri, { namespace, ttl });
  keyvObj.on('error', (err) => {
    logger.log('error', 'keyv error', err);
  });
  return keyvObj;
}
