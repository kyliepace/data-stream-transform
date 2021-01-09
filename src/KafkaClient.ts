import { Kafka, logLevel } from 'kafkajs';

export default new Kafka({
  logLevel: logLevel.INFO,
  clientId: 'producer',
  brokers: [`${process.env.HOST_IP}:9092`]
});