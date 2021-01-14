import { Request, Response } from 'express';
import IQuery from '../../interfaces/IQuery';
import DatabaseService from '../services/DatabaseService';

const databaseService = new DatabaseService();

export default async function(req: Request, res: Response){
  const { session_id } : IQuery = req.query;
  if (!session_id){
    return res.status(400).send('query is missing session_id');
  }

  try{
    const results = await databaseService.getData(session_id);
    console.log(results)
    return res.status(200).json(results);
  }
  catch(err){
    return res.status(500).send(err.message);
  }
}