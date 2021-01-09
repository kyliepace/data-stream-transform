import producer from './producers/models/producer';
import consumer from './consumers/consumer';


const run = async () => {
  // Producing
  await producer();

  // Consuming
  await consumer()

}

run().catch(console.error)