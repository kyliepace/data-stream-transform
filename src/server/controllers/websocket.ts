import { Request } from 'express';
import WebSocket from 'ws';
import KafkaProducer from '../services/KafkaProducer';
import PublishDataService from '../services/PublishData';


export default class WebSocketController {
  static publishDataService?: any;

  /**
   * set up websocket that interacts with connections through express route
   * called by `server/routes/index.ts`
   */
  static async onRoute(ws: WebSocket, req: Request){
    ws.on('message', this.publishDataService.publish.bind(this.publishDataService))
  }

  /**
   * given a connected Kafka Producer,
   * initialize the publishData service
   */
  static setService(producer: KafkaProducer){
    this.publishDataService = new PublishDataService(producer);
  }
}
