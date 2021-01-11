import WebSocket from 'ws';
import KafkaProducer from './models/KafkaProducer';

const port = 8080;
const server = new WebSocket.Server({
  port
});
console.log('listening on port ', port)

const producer = new KafkaProducer('test-topic');

async function run(){
  await producer.connect();
  console.log('producer connected')
}

run().catch()

server.on('connection', async function(socket: any) {
  console.log('new connection to webserver')
  socket.on('message', async function(msg: string) {
    console.log(msg)
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
