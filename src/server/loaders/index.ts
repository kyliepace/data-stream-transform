import express from 'express';
import expressLoader from './express';
import websocket from './websocket';
import kafka from './kafka';
import PublishData from '../services/PublishData';

export default async () => {
  const app = express();
  await expressLoader(app);
  // const kafkaProducer = await kafka();
  // const publishDataService = new PublishData(kafkaProducer);
  // const app = websocket(publishDataService);
  return app;
};