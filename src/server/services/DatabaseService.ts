import MongoRepository from "../../repositories/MongoRepository";


export default class TransformService {
  database: MongoRepository;

  constructor(DatabaseRepository = MongoRepository){
    this.database = new DatabaseRepository();
  }

  async getData(sessionId: string){
    console.log('session id: ', sessionId);
    const query = { session_id: sessionId };
    const results = await this.database.findOne(query);
    return results;
  }
}