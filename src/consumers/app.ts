import KafkaConsumer from './KafkaConsumer';

const consumer = new KafkaConsumer('test-topic', 'test-group');


async function run() {
    // Consuming
    await consumer.subscribe();

    const callback = ( { topic, partition, message}: any) => {
      return Promise.resolve(console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      }))
    };

    await consumer.onEvent(callback);
}

run().catch(err => {
  console.log(err)
})