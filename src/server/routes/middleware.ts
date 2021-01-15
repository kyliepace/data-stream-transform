import { NextFunction, Request, Response } from 'express';

export function handleError(err: Error, _req: Request, res: Response, _next: NextFunction){
  res.render('500', {
    status:  500,
    error: err
  });
}