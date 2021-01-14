import { EachMessagePayload } from "kafkajs";
import { safeParseJSON } from "../../helpers";
import IEvent from "../../interfaces/IEvent";
import MongoRepository from "../../repositories/MongoRepository";
import TypeEnum from "../../types/TypeEnum";

export default class TransformService {
  database: MongoRepository;

  constructor(DatabaseRepository = MongoRepository){
    this.database = new DatabaseRepository();
  }

  /**
   * return an array of events
   * without any of the SESSION_START or SESSION_END events
   * without mapping through entire array
   */
  buildChildData(firstTimestamp: number | null, lastTimestamp: number | null, data: IEvent[]): IEvent[] {
    // if a value exists for first timestamp,
    // remove that first event from the data array
    if (!!firstTimestamp){
      data.shift();
    }

    // if a value exists for the last timestamp,
    // remove that last event from the data array
    if (!!lastTimestamp){
      data.pop();
    }

    return data;
  }

  /**
   * only return the timestamp if it belongs to the first or last
   * event in the stream
   */
  getSessionTimestamp(data: IEvent, type: string): number | null {
    if (data.type === type){
      return data.timestamp;
    }
    return null;
  }


  /**
   * save data from an array of events
   * passed through kafka topic
   */
  async processMessage({ partition, message }: EachMessagePayload ): Promise<void> {
    const data = safeParseJSON<IEvent[]>(message?.value);
    const sessionId = safeParseJSON<string>(message.key);

    if (!data || !sessionId){
      console.error('no data in message')
      return;
    }

    console.log('message received', sessionId)

    await this.saveEvents(sessionId, data);
  }

  /**
   * save event data
   */
  async saveEvents(sessionId: string, data: IEvent[]): Promise<void> {
    const firstTimestamp = this.getSessionTimestamp(data[0], TypeEnum.SESSION_START);
    const lastTimestamp = this.getSessionTimestamp(data[data.length - 1], TypeEnum.SESSION_END);
    const childData = this.buildChildData(firstTimestamp, lastTimestamp, data);

    const query = {
      session_id: sessionId
    };
    const update = {
      $setOnInsert: {
        type: 'SESSION',
        start: firstTimestamp
      },
      $set: {
        end: lastTimestamp
      },
      $push: {
        children: {
          $each: childData,
          $sort: { 'data.timestamp': 1 }
        }
      }
    };
    const options = { upsert: true };
    await this.database.updateOne(query, update, options);
  }
}