import WebSocket from 'ws';
import MongoRepository from '../src/repositories/MongoRepository';


describe('websocket http request', () => {
  const database = new MongoRepository();
  const session_id = "e6fa79ca-d142-4046-a134-5134f16a0b5e";
  let clients;
  async function run() {
    clients[0].send(
      JSON.stringify([{
        timestamp: 1569972082,
        type: "SESSION_START",
        session_id
      }])
    );

    clients[0].send(
      JSON.stringify([{
        timestamp: 1569972085,
        type: "EVENT",
        name: "basket_removed"
      }])
    );

    clients[0].send(
      JSON.stringify([{
        timestamp: 1569972083,
        type: "EVENT",
        name: "purchase_completed"
      }])
    );

    console.log('client sent message')

    clients[0].send(
      JSON.stringify([{
        timestamp: 1569972086,
        type: "SESSION_END",
        session_id
      }])
    );
    console.log('client sent final message')

    return;
  }

  before(async () => {
    // clean up data
    await database.delete({
      session_id
    });

    clients = [
      new WebSocket('ws://localhost:8080/websocket?session_id="e6fa79ca-d142-4046-a134-5134f16a0b5e"')
    ];

    // Wait for the client to connect using async/await
    await new Promise(resolve => clients[0].once('open', resolve));
    console.log('connected');

    // send messages
    await run();
  });

  it('saves data', () => {

  })
});


