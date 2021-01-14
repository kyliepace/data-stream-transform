import { MongoClient } from 'mongodb';
import ip from 'ip';
const HOST_IP = process.env.HOST_IP || ip.address();

/**
 * how to query the mongo dbs
 * this should be a singleton
 */
class MongoConnector {
  cachedClient?: MongoClient;
  private client: MongoClient

  constructor(uri: string = `${HOST_IP}:27017`) {
    this.client = new MongoClient(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }


  async connect(): Promise<MongoClient> {
    if (!this.cachedClient) {
      await this.client.connect();
      this.cachedClient = this.client;
      console.log('mongo successfully connected');
    }
    return this.cachedClient;
  }
}

export default new MongoConnector(process.env.MONGO_URI);