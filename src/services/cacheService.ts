import config from 'config';
import redisService from './redisService';
import MemoryCacheService from './CacheService/MemoryCacheService';
import SQLiteCacheService from './CacheService/SQLiteCacheService';

const createCacheService = (): ICacheService => {
    const cacheType = process.env.CACHE_TYPE ?? config.get<string>('cache.type');

    if (cacheType === 'redis')
        return redisService;

    if (cacheType === 'memory')
        return new MemoryCacheService();

    if (cacheType === 'sqlite') {
        const dbPath = config.get<string>('cache.sqlite.dbPath');
        return new SQLiteCacheService(dbPath);
    }
    throw new Error(`Unsupported cache type: ${cacheType}`);
}

const cacheService = createCacheService();
export { createCacheService };
export default cacheService;