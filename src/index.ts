import KafkaProducer from './producers/models/KafkaProducer';
import KafkaConsumer from './consumers/KafkaConsumer';

const run = async () => {

  const producer = new KafkaProducer('test-topic');
  await producer.connect();

  // Producing
  await producer.sendMessages([
    {
      value: 'Hello KafkaJS user!'
    }
  ]);

  // Consuming
  const consumer = new KafkaConsumer('test-topic', 'test-group');

  const callback = ( { topic, partition, message}: any) => {
    return Promise.resolve(console.log({
      partition,
      offset: message.offset,
      value: message.value.toString(),
    }))
  };

  await consumer.onEvent(callback);

}

run().catch(console.error)