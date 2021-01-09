import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  clientId: 'producer',
  brokers: [`${process.env.HOST_IP}:9092`]
})

const producer = kafka.producer()

export default async function run() {
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })
}


// export default class Producer {
//   constructor(topicName: string, keySchema: any, valueSchema: any, numPartitions: number, numReplicas: number) {

//   }
// }