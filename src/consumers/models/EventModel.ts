import { EachMessagePayload } from "kafkajs";
import TypeEnum from "../../server/types/TypeEnum";
import { safeParseJSON } from "../helpers";
import IEvent from "../interfaces/IEvent";

export default class EventModel{
  timestamp?: number
  type?: TypeEnum
  name?: string
  session_id?: string

  async processMessage({ partition, message }: EachMessagePayload ): Promise<void> {
    const data: IEvent | null = safeParseJSON<IEvent>(message?.value);

    this.timestamp = data?.timestamp;
    this.type = data?.type as TypeEnum;
    if (data?.name){
      this.name = data.name;
    }
    if (data?.session_id){
      this.session_id = data.session_id;
    }

    return Promise.resolve(console.log({
      partition,
      offset: message.offset,
      event: {
        timestamp: this.timestamp
      }
    }))
  }
}