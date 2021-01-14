import IRepositoryLayer from "../../interfaces/IRepositoryLayer";
import RedisRepository from "../../repositories/RedisRepository";


export default class TransformService {
  database: IRepositoryLayer;

  constructor(DatabaseRepository = RedisRepository){
    this.database = new DatabaseRepository();
  }

  async getData(sessionId: string){
    console.log('session id: ', sessionId)
    const results = await this.database.get(sessionId);
    return results;
  }
}