import keyv from '@/utils/keyv';

export default abstract class AbstractCacheHandler {

  abstract model: any;

  abstract identifier: string;

  abstract namespace: string;

  objectID: string;

  cacheTtl: number = 30000;

  constructor(objectID: string) {
    this.objectID = objectID;
  }

  async get(): Promise<any> {
    const cache = keyv(this.namespace);
    let cachedObject = await cache.get(this.objectID);

    // if config was not found, load it from the db
    if (!cachedObject) {
      const object = await (this.model).findOne({ [this.identifier]: this.objectID }).lean();

      // check if options was found
      if (object) {
        cachedObject = object;
        await cache.set(this.objectID, cachedObject, this.cacheTtl);
      }
    }

    return cachedObject;
  }
}
