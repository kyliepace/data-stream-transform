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


  describe('sending multiple messages', () => {
    beforeEach(done => setTimeout(done, 500));
    before(() => {
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
            name: "basket_removed"
          }
        ])
      );

      clients[0].send(
        JSON.stringify([
          {
            timestamp: 1569972083,
            type: "EVENT",
            name: "purchase_completed"
          },
          {
            timestamp: 1569972086,
            type: "SESSION_END",
            session_id
          }
        ])
      );
    });

    it('saves data', async () => {
      const data = await database.findOne({session_id});
      console.log(data)
      chai.expect(data).to.have.property('session_id').which.equals(session_id);
      chai.expect(data).to.have.property('end').which.equals(1569972086);
      chai.expect(data).to.have.property('start').which.equals(1569972082);
      chai.expect(data).to.have.property('children').which.is.an('array');
      chai.expect(data.children.length).to.equal(2);
    });
  });

});


