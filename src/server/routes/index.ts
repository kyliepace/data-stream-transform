import { Router, Request } from 'express';
import WebSocket from 'ws';
import { urlPaths } from '../../constants.json';
import WebSocketController from '../controllers/websocket';
import GetDataController from '../controllers/getData';

// guaranteed to get dependencies
export default function routes(){
  const router = Router();

  // websocket route to save streamed data
  router.ws(`/${urlPaths.websocket}`, (ws: WebSocket, req: Request) => {
    console.log('websocket request established')
    ws.on('message', (msg: string) => {
      WebSocketController.onMessage(msg, req.query, ws);
    });
  });

  // GET endpoint to get the transformed data
  router.get('/data', GetDataController);

	return router
}