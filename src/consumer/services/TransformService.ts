import { EachMessagePayload } from "kafkajs";
import { safeParseJSON } from "../../helpers";
import IEvent from "../../interfaces/IEvent";
import ITransformedData from "../../interfaces/ITransformedData";
import TypeEnum from "../../types/TypeEnum";
import SaveDataService from "./SaveDataService";

/**
 *
 * service to transform data from event format
 * to desired end format
 */
export default class TransformService {
  saveDataService: SaveDataService;

  constructor(saveDataService = SaveDataService){
    this.saveDataService = new saveDataService();
  }

  /**
   * return an array of events
   * without any of the SESSION_START or SESSION_END events
   * without mapping through entire array
   */
  buildChildData(data: IEvent[], firstTimestamp?: number, lastTimestamp?: number): IEvent[] {
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
  getSessionTimestamp(data: IEvent, type: string): number | undefined {
    if (data.type === type){
      return data.timestamp;
    }
    return;
  }


  /**
   * save data from an array of events
   * passed through kafka topic
   */
  async processMessage({ message }: EachMessagePayload ): Promise<void> {
    const data = safeParseJSON<IEvent[]>(message?.value);
    const sessionId = safeParseJSON<string>(message.key);

    if (!data || !sessionId){
      console.error('no data in message', {
        value: data,
        key: sessionId
      });
      return;
    }

    console.log('message received', sessionId)

    const transformedData = this.transformData(sessionId, data);
    await this.saveDataService.saveEvents(transformedData);
  }

  /**
   * find any of the first or last events
   * and group the rest as children
   */
  transformData(sessionId: string, data: IEvent[]): ITransformedData {
    const firstTimestamp = this.getSessionTimestamp(data[0], TypeEnum.SESSION_START);
    const lastTimestamp = this.getSessionTimestamp(data[data.length - 1], TypeEnum.SESSION_END);
    const childData = this.buildChildData(data, firstTimestamp, lastTimestamp);

    return {
      session_id: sessionId,
      type: 'SESSION',
      start: firstTimestamp,
      end: lastTimestamp,
      children: childData
    }
  }

}