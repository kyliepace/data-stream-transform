import Redis from 'ioredis';
import ip from 'ip';

const HOST_IP = process.env.HOST_IP || ip.address();
/**
 * singleton connection to redis database
 * not so important on an express app but
 * if this ever got broken up into lambda functions
 * we'd want to reuse the existing connection
 */
class RedisClient {
  client;

  // init redis; how to use: https://github.com/luin/ioredis#basic-usage
  constructor(uri?: string) {
    this.client = new Redis(uri);
  }
}

export default new RedisClient(`${HOST_IP}:6379`);