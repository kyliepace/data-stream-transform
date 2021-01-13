import loaders from './loaders';
import * as constants from '../constants.json';

async function startServer() {

  /**
   * load express application
   **/
  const app = await loaders();
  const port = constants.PORT;

  // start the server
  app.listen(port, () => (
    console.log(`Running on :${port} 👍`)
  )).on('error', err => {
    console.error(err);
    process.exit(1);
  });
}

startServer();

