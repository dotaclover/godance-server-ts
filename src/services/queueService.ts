import { Redis, RedisOptions } from 'ioredis';
import config from '../startup/config';

class SimpleQueue {
    private client: Redis;

    constructor(redisOptions: RedisOptions) {
        this.client = new Redis(redisOptions);
    }

    async push(queueName: string, value: string): Promise<void> {
        await this.client.lpush(queueName, value);
    }

    async pop(queueName: string): Promise<string | null> {
        return this.client.rpop(queueName);
    }

    async length(queueName: string): Promise<number> {
        return this.client.llen(queueName);
    }

    async peek(queueName: string): Promise<string | null> {
        const items = await this.client.lrange(queueName, -1, -1);
        return items.length > 0 ? items[0] : null;
    }

    async clear(queueName: string): Promise<void> {
        await this.client.del(queueName);
    }
}

const redisOptions = config.get("redis") as RedisOptions;
const queueService = new SimpleQueue(redisOptions);
export default queueService;