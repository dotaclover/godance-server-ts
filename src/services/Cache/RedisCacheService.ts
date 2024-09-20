import Redis, { RedisOptions } from 'ioredis';

class RedisCacheService implements ICacheService {
    private client: Redis;

    constructor(redisOptions: RedisOptions) {
        this.client = new Redis(redisOptions);
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const serializedValue = JSON.stringify(value);
        if (ttl) {
            await this.client.set(key, serializedValue, 'EX', ttl);
        } else {
            await this.client.set(key, serializedValue);
        }
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}

export default RedisCacheService;
