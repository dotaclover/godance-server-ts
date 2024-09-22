import config from 'config';
import MemoryCacheService from './Cache/MemoryCacheService';
import SQLiteCacheService from './Cache/SQLiteCacheService';
import RedisCacheService from './Cache/RedisCacheService';

let memoryCache: MemoryCacheService;
let sqliteCache: SQLiteCacheService;
let redisCache: RedisCacheService;
export function createCacheService(): ICacheService {
    const cacheType = process.env.CACHE_TYPE ?? config.get<string>('cache.type');

    if (cacheType === 'redis') {
        if (!redisCache)
            redisCache = new RedisCacheService()
        return redisCache;
    }

    if (cacheType === 'memory') {
        if (!memoryCache)
            memoryCache = new MemoryCacheService();
        return memoryCache;
    }

    if (cacheType === 'sqlite') {
        //如果使用内存数据库db=':memory:'
        const dbPath = config.get<string>('cache.sqlite.dbPath');
        if (!sqliteCache)
            sqliteCache = new SQLiteCacheService(dbPath);
        return sqliteCache;
    }

    throw new Error(`Unsupported cache type: ${cacheType}`);
}

const cacheService = createCacheService();
export default cacheService;