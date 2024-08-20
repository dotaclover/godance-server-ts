import config from 'config';
import { Redis, RedisOptions } from 'ioredis';

interface RedisServiceOptions {
    host?: string;
    port?: number;
    db?: number;
    password?: string;
}

export class RedisService {
    private client: Redis;

    constructor(options?: RedisServiceOptions) {
        this.client = new Redis({
            host: options?.host || '127.0.0.1',
            port: options?.port || 6379,
            db: options?.db || 0,
            password: options?.password,
        });
    }

    // Set key-value pair
    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    // Set key-value pair with expiration time (seconds)
    async setex(key: string, value: string, seconds: number): Promise<void> {
        await this.client.setex(key, seconds, value);
    }

    // Set key-value pair only if key does not exist
    async setnx(key: string, value: string): Promise<boolean> {
        const result = await this.client.setnx(key, value);
        return result === 1;
    }

    // Set key-value pair and return the old value
    async getset(key: string, value: string): Promise<string | null> {
        return await this.client.getset(key, value);
    }

    // Get value by key
    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    // Queue operations: LPUSH (enqueue), RPOP (dequeue)
    async enqueue(queueName: string, value: string): Promise<void> {
        await this.client.lpush(queueName, value);
    }

    async dequeue(queueName: string): Promise<string | null> {
        return await this.client.rpop(queueName);
    }

    // Get queue length
    async queueLength(queueName: string): Promise<number> {
        return await this.client.llen(queueName);
    }

    // MAP operations using hash: HSET, HGET, HDEL
    async hset(mapName: string, key: string, value: string): Promise<void> {
        await this.client.hset(mapName, key, value);
    }

    async hget(mapName: string, key: string): Promise<string | null> {
        return await this.client.hget(mapName, key);
    }

    async hdel(mapName: string, key: string): Promise<number> {
        return await this.client.hdel(mapName, key);
    }

    // SET operations: SADD, SREM, SMEMBERS
    async sadd(setName: string, value: string): Promise<number> {
        return await this.client.sadd(setName, value);
    }

    async srem(setName: string, value: string): Promise<number> {
        return await this.client.srem(setName, value);
    }

    async smembers(setName: string): Promise<string[]> {
        return await this.client.smembers(setName);
    }

    // Close the Redis connection
    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}

const options = config.get("reids") as RedisOptions;
const redisService = new RedisService(options);
export default redisService;