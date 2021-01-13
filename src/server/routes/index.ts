import { Router } from 'express';
import { urlPaths } from '../../constants.json';
import WebSocketController from '../controllers/websocket';

// guaranteed to get dependencies
export default function routes(){
  const router = Router();

  router.ws(`/${urlPaths.websocket}`, WebSocketController.onRoute.bind(WebSocketController));
  router.get('/data')
	return router
}