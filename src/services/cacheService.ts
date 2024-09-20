import config from 'config';
import redisService from './redisService';
import MemoryCacheService from './Cache/MemoryCacheService';
import SQLiteCacheService from './Cache/SQLiteCacheService';

export function createCacheService(): ICacheService {
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
export default cacheService;