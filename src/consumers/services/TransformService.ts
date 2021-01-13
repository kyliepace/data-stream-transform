import { EachMessagePayload } from "kafkajs";
import { safeParseJSON } from "../helpers";
import IEvent from "../interfaces/IEvent";
import EventModel from "../models/EventModel";


export default class TransformService {
  Model;
  database;
  constructor(Model = EventModel, databaseRepository?: any){
    this.Model = Model;
    this.database = databaseRepository;
  }

  async processMessage({ partition, message }: EachMessagePayload ): Promise<void> {
    const data: IEvent | null = safeParseJSON<IEvent>(message?.value);
    if (!data){
      return;
    }

    const dataModel = new this.Model(data);


    return Promise.resolve(console.log({
      partition,
      offset: message.offset,
      event: {
        timestamp: dataModel.timestamp
      }
    }))
  }
}