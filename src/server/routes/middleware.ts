import { NextFunction, Request, Response } from 'express';

export function handleError(err: Error, req: Request, res: Response, next: NextFunction){
  res.render('500', {
    status:  500,
    error: err
  });
}