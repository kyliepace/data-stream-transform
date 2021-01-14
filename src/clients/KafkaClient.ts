import { Kafka, logLevel } from 'kafkajs';
import ip from 'ip';

const HOST_IP = process.env.HOST_IP || ip.address();

export default new Kafka({
  logLevel: logLevel.INFO,
  clientId: 'data-transformation-app',
  brokers: [`${HOST_IP}:9092`]
});