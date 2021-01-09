import KafkaProducer from './producers/models/KafkaProducer';
import KafkaConsumer from './consumers/KafkaConsumer';

const WebSocket = require('ws');

const server = new WebSocket.Server({
  port: 8080
});


const producer = new KafkaProducer('test-topic');
const consumer = new KafkaConsumer('test-topic', 'test-group');

async function run(){
  await producer.connect();
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

run();

server.on('connection', async function(socket: any) {



  socket.on('message', async function(msg: string) {
      // Producing
    await producer.sendMessages([
      {
        value: 'Hello KafkaJS user!'
      }
    ]);
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    console.log('goodbye')
  });
});
