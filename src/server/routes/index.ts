import { Router } from 'express';
import { urlPaths } from '../../constants.json';

// guaranteed to get dependencies
export default function routes(){
  const router = Router();

  router.ws(`/${urlPaths.websocket}`, (ws, req) => {
    ws.on('message', function(msg) {
      console.log(msg);
      console.log(req.query.sessionId)
    });
  });
  router.get('/data')
	return router
}