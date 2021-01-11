const WebSocket = require('ws');

let clients = [
  new WebSocket('ws://localhost:8080'),
  new WebSocket('ws://localhost:8080')
];



async function run() {
  clients.map(client => {
    client.on('message', msg => console.log(msg));
  });

  // Wait for the client to connect using async/await
  await new Promise(resolve => clients[0].once('open', resolve));

  // Prints "Hello!" twice, once for each client.
  clients[0].send(
    JSON.stringify({
      value: 'Hello KafkaJS user!'
    })
  );
  console.log('client sent message')
  return;
}

run()