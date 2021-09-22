import keyv from '@/utils/keyv';

export default abstract class AbstractCacheHandler {

  abstract model: any;

  abstract identifier: string;

  abstract namespace: string;

  objectID: string;

  objectIDs: string[];

  cacheTtl: number = 30000;

  constructor(objectIDs: string | string[]) {
    if (typeof objectIDs === 'string') {
      this.objectID = objectIDs;
      this.objectIDs = [objectIDs];
    } else {
      this.objectID = objectIDs[0];
      this.objectIDs = objectIDs;
    }
  }

  async get(identifier?: string): Promise<any> {
    const cache = keyv(this.namespace);
    let cachedObject = await cache.get(this.objectID);

    // if object was not found, load it from the db
    if (!cachedObject) {
      const object = await (this.model).findOne({ [(identifier ? identifier : this.identifier)]: this.objectID }).lean();

      // check if object was found
      if (object) {
        cachedObject = object;
        await cache.set(this.objectID, cachedObject, this.cacheTtl);
      }
    }

    return cachedObject;
  }

  // async getAll(): Promise<[any]> {
  //   const cachedObjects: any = [];
  //   const cache = keyv(this.namespace);
  //   let objectIDs: string[];
  //   const dbRequest: any = [];

  //   objectIDs = this.objectIDs;
  //   // if (identifier) {
  //   //   objectIDs = this.objectIDs;
  //   // } else {
  //   //   objectIDs = this.objectIDs;
  //   // }

  //   console.log('aa');

  //   objectIDs.forEach(async (objectID) => {
  //     // let cachedObject = await cache.get(objectID);

  //     // // if object was not found, push it to db request
  //     // if (!cachedObject) {
  //     //   dbRequest.push(objectID);
  //     // } else {
  //     //   cachedObjects.push(cachedObject);
  //     // }
  //   });

  //   console.log('bb');

  //   // if (dbRequest) {

  //   //   console.log('cc');

  //   //   const objects = await (this.model).find({
  //   //     [this.identifier]: {
  //   //       $in: dbRequest,
  //   //     },
  //   //   }).lean();

  //   //   // update objects
  //   //   objects.forEach(async (object: any) => {
  //   //     await cache.set(object[this.identifier], object, this.cacheTtl);
  //   //     cachedObjects.push(object);
  //   //   });
  //   // }

  //   console.log('dd');

  //   return cachedObjects;
  // }
}