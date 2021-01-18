import ITransformedData from "../../interfaces/ITransformedData";
import MongoRepository from "../../repositories/MongoRepository";


export default class TransformService {
  database: MongoRepository;

  constructor(DatabaseRepository = MongoRepository){
    this.database = new DatabaseRepository();
  }

  async getData(sessionId: string): Promise<ITransformedData | null >{
    const query = { session_id: sessionId };
    const results = await this.database.findOne(query);
    return results;
  }
}