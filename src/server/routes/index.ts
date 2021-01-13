import { Router, Request } from 'express';
import WebSocket from 'ws';
import { urlPaths } from '../../constants.json';
import WebSocketController from '../controllers/websocket';

// guaranteed to get dependencies
export default function routes(){
  const router = Router();

  router.ws(`/${urlPaths.websocket}`, (ws: WebSocket, req: Request) => {
    console.log('websocket request established')
    ws.on('message', (msg: string) => {
      WebSocketController.onMessage(msg, req.query, ws);
    });
  });
  router.get('/data')
	return router
}