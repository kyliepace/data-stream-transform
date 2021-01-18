import chai from 'chai';
import WebSocket from 'ws';
import MongoRepository from '../src/repositories/MongoRepository';


describe('websocket http request', () => {
  const database = new MongoRepository();
  const session_id = "e6fa79ca-d142-4046-a134-5134f16a0b5e";
  let clients;

  before(async () => {
    // clean up data
    await database.delete({
      session_id
    });

    clients = [
      new WebSocket(`ws://localhost:8080/websocket?session_id=${session_id}`)
    ];

    // Wait for the client to connect using async/await
    await new Promise(resolve => clients[0].once('open', resolve));
    console.log('connected');
  });


  describe('sending multiple messages with child events not in order', () => {
    // give consumer app some time to receive kafka message
    beforeEach(done => setTimeout(done, 1800));
    before(() => {

      // send session_start and the last event
      clients[0].send(
        JSON.stringify([
          {
            timestamp: 1569972082,
            type: "SESSION_START",
            session_id
          },
          {
            timestamp: 1569972085,
            type: "EVENT",
            name: "last_event"
          }
        ])
      );

      // send the middle events and then session_end
      clients[0].send(
        JSON.stringify([
          {
            timestamp: 1569972083,
            type: "EVENT",
            name: "middle_event"
          },
          {
            timestamp: 1569972083,
            type: "EVENT",
            name: "first_event"
          },
          {
            timestamp: 1569972086,
            type: "SESSION_END",
            session_id
          }
        ])
      );
    });

    it('saves data with child events in order by timestamp and with start and end timestamps', async () => {
      const data = await database.findOne({session_id});
      console.log(data)
      chai.expect(data).to.have.property('session_id').which.equals(session_id);
      chai.expect(data).to.have.property('end').which.equals(1569972086);
      chai.expect(data).to.have.property('start').which.equals(1569972082);
      chai.expect(data).to.have.property('children').which.is.an('array');
      chai.expect(data.children.length).to.equal(3);
      chai.expect(data.children).to.deep.equal([
        {
          type: 'EVENT',
          timestamp: 1569972083,
          name: 'middle_event'
        },
        {
          type: 'EVENT',
          timestamp: 1569972083,
          name: 'first_event'
        },
        {
          type: 'EVENT',
          timestamp: 1569972085,
          name: 'last_event'
        }
      ])
    });
  });

});


