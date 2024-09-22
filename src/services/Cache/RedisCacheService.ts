import redisService from '../redisService';

class RedisCacheService implements ICacheService {

    async get<T>(key: string): Promise<T | null> {
        const value = await redisService.get(key);
        return value as unknown as T;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        if (ttl) {
            await redisService.set(key, value, ttl);
        } else {
            await redisService.set(key, value);
        }
    }

    async delete(key: string): Promise<void> {
        await redisService.delete(key);
    }
}

export default RedisCacheService;
