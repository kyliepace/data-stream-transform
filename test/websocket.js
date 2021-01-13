const WebSocket = require('ws');

let clients = [
  new WebSocket('ws://localhost:8080/websocket?sessionId=12')
];



async function run() {

  // Wait for the client to connect using async/await
  await new Promise(resolve => clients[0].once('open', resolve));
  console.log('connected');

  clients[0].send(
    JSON.stringify({
      timestamp: 1569972082,
      type: "SESSION_START",
      session_id: "e6fa79ca-d142-4046-a134-5134f16a0b5e"
    })
  );

  console.log('client sent message')


  setTimeout(() => (clients[0].send(
    JSON.stringify({
      timestamp: 1569972085,
      type: "SESSION_END",
      session_id: "e6fa79ca-d142-4046-a134-5134f16a0b5e"
    }))
  ), 2000);
  console.log('client sent final message')

  return;
}

run()