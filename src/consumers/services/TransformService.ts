import { EachMessagePayload } from "kafkajs";
import { safeParseJSON } from "../helpers";
import IEvent from "../../interfaces/IEvent";
import IRepositoryLayer from "../../interfaces/IRepositoryLayer";
import EventModel from "../models/EventModel";
import RedisRepository from "../repositories/RedisRepository";
import TypeEnum from "../../types/TypeEnum";


export default class TransformService {
  database: IRepositoryLayer;

  constructor(DatabaseRepository = RedisRepository){
    this.database = new DatabaseRepository();
  }

  /**
   * create initial entry with start timestamp
   */
  async createRecord(sessionId: string, event: IEvent): Promise<string | null>{
    const record = {
      type: 'SESSION',
      start: event.timestamp,
      children: []
    };

    return await this.database.save(sessionId, record);
  }

  /**
   * save data from an array of events
   * passed through kafka topic
   */
  async processMessage({ partition, message }: EachMessagePayload ): Promise<void> {
    const data = safeParseJSON<IEvent[]>(message?.value);
    const sessionId = safeParseJSON<string>(message.key);

    if (!data || !sessionId){
      return;
    }

    await this.saveIfStartSession(sessionId, data[0]);
    await this.saveValidatedData(sessionId, data)
  }

  /**
   * if event.type === SESSION_START,
   * then create new record in redis
   */
  async saveIfStartSession(sessionId: string, event: IEvent): Promise<void>{
    if (event.type === TypeEnum.SESSION_START){
      await this.createRecord(sessionId, event);
    }
  }

  async saveValidatedData(sessionId: string, data: IEvent[]): Promise<> {
    const modeledData = data.map(event => new EventModel(sessionId, event));
    return await this.database.save(sessionId, modeledData)
  }
}