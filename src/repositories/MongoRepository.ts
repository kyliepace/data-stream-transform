import {
  Db,
  Collection,
  FindAndModifyWriteOpResultObject,
  ObjectID,
  FilterQuery,
  FindOneOptions,
  UpdateOneOptions,
  UpdateQuery
} from 'mongodb';
import MongoClient from "../clients/MongoClient";
import * as constants from '../constants.json';

export default class MongoRepository {
  collectionName: string;
  dbName: string;
  private cachedDb?: Db;

  constructor(dbName: string = constants.mongodb.db, collectionName: string = constants.mongodb.collection){
    this.collectionName = collectionName;
    this.dbName = dbName;
  }

  /**
   * connect to the db
   * and return the targeted collection method
   */
  async connect() {
    const client = await MongoClient.connect();
    this.cachedDb = client.db(this.dbName);
    return this.cachedDb.collection(this.collectionName)
  }

  /**
   * try to use existing connection
   * but if it's falled over, re-connect
   * and return the targeted collection method
   */
  async collection(): Promise<Collection>{
    return this.cachedDb ? this.cachedDb.collection(this.collectionName) : await this.connect();
  }

  async delete<T>(query: FilterQuery<T>): Promise<void>{
    const collection = await this.collection()
    const result = await collection.deleteOne(query);
    console.log(`${result.deletedCount} documents deleted`);
  }

  disconnect(){
    MongoClient.disconnect();
  }

  async findOne<T>(query: FilterQuery<T>, options?: FindOneOptions<T extends any ? any : T>): Promise<any | null> {
    const collection = await this.collection()
    return collection.findOne(
        query,
        options
      );
  }

  async updateOne<T>(
    query: FilterQuery<any>,
    update: UpdateQuery<T>,
    options?: UpdateOneOptions
  ) : Promise<T | undefined> {
    const collection = await this.collection()

    const result: FindAndModifyWriteOpResultObject<(T & {_id: ObjectID})> = await collection
      .findOneAndUpdate(
        query,
        update,
        {
          returnOriginal: false,
          ...options
        }
      );
    console.log('data updated');
    return result.value;
  }
}