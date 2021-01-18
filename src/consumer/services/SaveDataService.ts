import ITransformedData from "../../interfaces/ITransformedData";
import MongoRepository from "../../repositories/MongoRepository";

/**
 * service to save data to mongo
 */
export default class SaveDataService {
  database: MongoRepository;

  constructor(DatabaseRepository = MongoRepository){
    this.database = new DatabaseRepository();
  }

  /**
   * save each message to mongodb
   */
  async saveEvents(data: ITransformedData){
    const query = {
      session_id: data.session_id
    };
    const update = {
      $setOnInsert: {
        type: data.type,
        start: data.start
      },
      $set: {
        end: data.end
      },
      $push: {
        children: {
          $each: data.children,
          // sort asc on timestamp so oldest events will be at beginning of array
          $sort: { 'timestamp': 1 }
        }
      }
    };
    const options = { upsert: true };
    await this.database.updateOne(query, update, options);
  }
}