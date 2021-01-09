import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  clientId: 'producer',
  brokers: [`${process.env.HOST_IP}:9092`]
})

const consumer = kafka.consumer({ groupId: 'test-group' })


export default async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: any) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}