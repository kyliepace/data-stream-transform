import { safeParseJSON } from './helpers';
import KafkaConsumer from './KafkaConsumer';
import EventModel from './models/EventModel';
import * as constants from '../constants.json';


async function run() {
  const event = new EventModel();
  const consumer = new KafkaConsumer(constants.topics.EVENTS, 'test-group', event.processMessage);
  // Consuming
  await consumer.subscribe();


  await consumer.onEvent();

  // make sure connections close on program exit
  process.on('SIGINT', function() {
    console.log('\n gracefully exiting')
    consumer.close();
    process.exit();
  });
}

run().catch(err => {
  console.log(err)
})