import { safeParseJSON } from './helpers';
import KafkaConsumer from './KafkaConsumer';
import * as constants from '../constants.json';

const consumer = new KafkaConsumer(constants.topics.EVENTS, 'test-group');


async function run() {
  // Consuming
  await consumer.subscribe();

  const callback = ( { topic, partition, message}: any) => {
    const data = safeParseJSON(message.value);

    return Promise.resolve(console.log({
      partition,
      offset: message.offset,
      data
    }))
  };

  await consumer.onEvent(callback);

  process.on('SIGINT', function() {
    console.log('\n gracefully exiting')
    consumer.close();
    process.exit();
  });
}

run().catch(err => {
  console.log(err)
})