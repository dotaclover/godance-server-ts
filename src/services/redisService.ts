import config from '../bootstrap/config';
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
            connectTimeout: 10000,
            keepAlive: 30000
        });
    }

    // Updated get method in RedisService class
    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);

        if (!value) return null;

        try {
            const parsedValue = JSON.parse(value);
            return parsedValue as T;
        } catch (error) {
            return value as unknown as T;
        }
    }

    async getRaw(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const serializedValue = JSON.stringify(value);
        if (ttl) {
            await this.client.setex(key, ttl, serializedValue);
        } else {
            await this.client.set(key, serializedValue);
        }
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

    async peek(queueName: string): Promise<string[]> {
        return await this.client.lrange(queueName, -1, -1);
    }

    async delete(key: string): Promise<number> {
        return await this.client.del(key);
    }

    // Close the Redis connection
    async disconnect(): Promise<void> {
        await this.client.quit();
    }

    async connect(): Promise<void> {
        if (['ready', 'connecting'].includes(this.client.status))
            return;
        await this.client.connect();
    }


    async flushDB(): Promise<void> {
        await this.client.flushdb();
    }
}

const options = config.get("redis") as RedisOptions;
const redisService = new RedisService(options);
export default redisService;