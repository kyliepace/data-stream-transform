import RedisClient from '../clients/RedisClient';
import { jsonToString, safeParseJSON } from '../helpers';
import IRepositoryLayer from '../interfaces/IRepositoryLayer';

export default class RedisRepository implements IRepositoryLayer {
  client;

  constructor(client = RedisClient.client) {
    this.client = client;
  }

  async save<T>(key: string, data: T): Promise<string | null> {
    const value = jsonToString(data);
    console.log(`data saved in redis`)
    return await this.client.set(key, value);
  }

  async find<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    console.log(`data found in redis`)
    return safeParseJSON(data);
  }
}