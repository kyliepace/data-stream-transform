import KafkaProducer from '../services/KafkaProducer';
import * as constants from '../../constants.json';

const producer = new KafkaProducer(constants.topics.EVENTS);

export default async function connect(): Promise<KafkaProducer> {
  await producer.connect();
  console.log('producer connected')
  return producer
}