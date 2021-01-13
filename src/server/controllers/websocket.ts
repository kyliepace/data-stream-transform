import WebSocket from 'ws';
import { safeParseJSON } from '../../consumers/helpers';
import IEvent from '../../consumers/interfaces/IEvent';
import KafkaProducer from '../services/KafkaProducer';
import PublishDataService from '../services/PublishData';
import TypeEnum from '../types/TypeEnum';

/**
 * REST endpoint query params
 */
interface IQuery {
  session_id?: string
}

export default class WebSocketController {
  static publishDataService?: any;

  /**
   * per the data contract, the final message for a session id
   * will have type 'SESSION_END'
   * once that has been received, close the ws client connection
   */
  static closeIfSessionEnd(msg: string, ws: WebSocket): void {
    const data: IEvent[] | null = safeParseJSON<IEvent[]>(msg);
    if (!data){ return; }

    const finalMessage = data[data.length - 1];
    if (this.isSessionEnd(finalMessage)){
      console.log('SESSION_END has arrived; closing session');
      ws.terminate();
    }
  }

  /**
   * handle each incoming message from client websocket connection
   */
  static async onMessage(msg: string, { session_id }: IQuery, ws: WebSocket ) {
    // publish each message string with the session id
    this.publishDataService.publish.bind(this.publishDataService)(msg, session_id);

    // close session if "SESSION_END" has been sent
    this.closeIfSessionEnd(msg, ws);
  }

  /**
   * returns true if the event type is "SESSION_END"
   */
  static isSessionEnd(event: IEvent): boolean {
    return event.type === TypeEnum.SESSION_END;
  }

  /**
   * given a connected Kafka Producer,
   * initialize the publishData service
   */
  static setService(producer: KafkaProducer){
    this.publishDataService = new PublishDataService(producer);
  }
}
