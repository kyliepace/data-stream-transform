import WebSocket from 'ws';
import * as constants from '../../constants.json';
import PublishData from '../services/PublishData';

export default (publishService: PublishData): WebSocket.Server => {
  const server = new WebSocket.Server({
    port: constants.PORT
  });
  console.log(`Running on :${constants.PORT} 👍`);

  server.on('connection', async function(socket: any) {
    console.log('new connection to webserver');

    socket.on('message', async function(msg: string) {
      // publish data
      await publishService.publish(msg);
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function() {
      console.log('a socket connection has closed')
    });

    socket.on('disconnect', function() {
      console.log('closing');
      publishService.pubsubService.close();
      server.close();
    });
  });

  process.on('SIGINT', function() {
    console.log('\n gracefully exiting')
    publishService.pubsubService.close();
    server.close()
    process.exit();
  });

  return server;
}

