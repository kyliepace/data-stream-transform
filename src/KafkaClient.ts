import { Kafka, logLevel } from 'kafkajs';

const HOST_IP = process.env.HOST_IP;

export default new Kafka({
  logLevel: logLevel.INFO,
  clientId: 'data-transformation-app',
  brokers: [`${HOST_IP}:9092`]
});