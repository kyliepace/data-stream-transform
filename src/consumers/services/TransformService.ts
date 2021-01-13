import { EachMessagePayload } from "kafkajs";
import { safeParseJSON } from "../helpers";
import IEvent from "../../interfaces/IEvent";
import IRepositoryLayer from "../../interfaces/IRepositoryLayer";
import RedisRepository from "../repositories/RedisRepository";
import TypeEnum from "../../types/TypeEnum";


export default class TransformService {
  database: IRepositoryLayer;

  constructor(DatabaseRepository = RedisRepository){
    this.database = new DatabaseRepository();
  }

  /**
   * generate the value for the field to be saved in redis hash
   * append the timestamp to the name because cannot know that the name values will be unique
   */
  buildFieldString(event: IEvent): string {
    return event.type === TypeEnum.EVENT ? `${event.name}:${event.timestamp}` : event.type;
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
   * save event data in sorted set
   */
  async saveEvents(sessionId: string, data: IEvent[]): Promise<void> {
    await Promise.all(data.map(event => {
      const field = this.buildFieldString(event);
      return this.database.save(sessionId, field, event.timestamp)
    }));
  }
}