import WebSocket from 'ws';
import { safeParseJSON } from '../../consumers/helpers';
import IEvent from '../../consumers/interfaces/IEvent';
import KafkaProducer from '../services/KafkaProducer';
import PublishDataService from '../services/PublishData';

interface IQuery {
  sessionId?: string
}
export default class WebSocketController {
  static publishDataService?: any;

  /**
   * per the data contract, the final message for a session id
   * will have type 'SESSION_END'
   */
  static closeIfSessionEnd(msg: string, ws: WebSocket) {
    const data = safeParseJSON<IEvent>(msg);
    if (data?.type === 'SESSION_END'){
      console.log('SESSION_END has arrived; closing session');
      ws.terminate();
    }
  }

  static async onMessage(msg: string, { sessionId }: IQuery, ws: WebSocket ) {
    // publish each message string with the session id
    this.publishDataService.publish.bind(this.publishDataService)(msg, sessionId);

    // close session if SESSION_END has been sent
    this.closeIfSessionEnd(msg, ws);
  }

  /**
   * given a connected Kafka Producer,
   * initialize the publishData service
   */
  static setService(producer: KafkaProducer){
    this.publishDataService = new PublishDataService(producer);
  }
}
