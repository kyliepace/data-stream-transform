import express from 'express';
import bodyParser from 'body-parser';
import { handleError } from '../routes/middleware';
import routes from '../routes';
import expressWs from 'express-ws';

export default (app: express.Application) => {
  expressWs(app);

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // routes
  app.use(routes());

  // error handling
  app.use(handleError)
};