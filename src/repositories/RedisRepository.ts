import RedisClient from '../clients/RedisClient';
import { jsonToString, safeParseJSON } from '../helpers';
import IRepositoryLayer from '../interfaces/IRepositoryLayer';

export default class RedisRepository implements IRepositoryLayer {
  client;

  constructor(client = RedisClient.client) {
    this.client = client;
  }

  async find<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    console.log(`data found in redis`)
    return safeParseJSON(data);
  }

  async get<T>(key: string): Promise<Record<string, string>>{
    return await this.client.hgetall(key);
  }

  /**
   * save hash
   * https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/1-2-4-hashes-in-redis/
   */
  async save<T>(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
    console.log(`data saved in redis`);
  }

}