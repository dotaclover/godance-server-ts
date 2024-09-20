import config from 'config';
import redisService from './redisService';
import MemoryCacheService from './CacheService/MemoryCacheService';
import SQLiteCacheService from './CacheService/SQLiteCacheService';

const createCacheService = (): ICacheService => {
    const cacheType = config.get<string>('cache.type');

    if (cacheType === 'redis') {
        return redisService;
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