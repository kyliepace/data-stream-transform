import KafkaProducer from '../services/KafkaProducer';
import * as constants from '../../constants.json';
import WebSocketController from '../controllers/websocket';

const producer = new KafkaProducer(constants.topics.EVENTS);

export default async function connect(): Promise<void> {
  await producer.connect();
  console.log('producer connected');

  // load kafka producer into the WebSocket controller
  // so the controller can use the producer to publish messages
  WebSocketController.setService(producer);
}