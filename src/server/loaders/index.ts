import express from 'express';
import expressLoader from './express';
import kafkaLoader from './kafka';

export default async () => {
  const app = express();
  await kafkaLoader();
  await expressLoader(app);
  return app;
};