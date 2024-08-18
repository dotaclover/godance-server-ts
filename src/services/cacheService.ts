import config from 'config';
import { RedisOptions } from 'ioredis';
import MemoryCacheService from './CacheService/MemoryCacheService';
import RedisCacheService from './CacheService/RedisCacheService';
import SQLiteCacheService from './CacheService/SQLiteCacheService';

const createCacheService = (): ICacheService => {
    const cacheType = config.get<string>('cache.type');

    if (cacheType === 'redis') {
        const redisOptions = config.get<RedisOptions>('cache.redis');
        return new RedisCacheService(redisOptions);
    }

    if (cacheType === 'sqlite') {
        const dbPath = config.get<string>('cache.sqlite.dbPath');
        return new SQLiteCacheService(dbPath);
    }

    if (cacheType === 'memory')
        return new MemoryCacheService();

    throw new Error(`Unsupported cache type: ${cacheType}`);
}

export default createCacheService();