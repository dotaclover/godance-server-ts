import { createCacheService } from '../../src/services/cacheService';
import redisService from '../../src/services/redisService';

let cacheService: ICacheService;

describe('Cache Service Tests', () => {


    describe('Memory Cache Service', () => {
        beforeAll(() => {
            process.env.CACHE_TYPE = 'memory';
            cacheService = createCacheService();
        });

        it('should set and get value from memory cache', async () => {
            const key = 'testKey';
            const value = 'testValue';

            await cacheService.set(key, value);
            const result = await cacheService.get<string>(key);

            expect(result).toBe(value);
        });

        it('should return null for expired value from memory cache', async () => {
            const key = 'testKey';
            const value = 'testValue';
            await cacheService.set(key, value, 1);  // Set TTL to 1 second

            // Wait for 2 seconds to make sure it expires
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = await cacheService.get<string>(key);
            expect(result).toBeNull();
        });
    });

    describe('Redis Cache Service', () => {
        beforeAll(() => {
            process.env.CACHE_TYPE = 'redis';
            cacheService = createCacheService();
        });

        afterAll(() => {
            redisService.disconnect();
        });

        it('should set and get value from redis cache', async () => {
            const key = 'redisKey';
            const value = 'redisValue';

            await cacheService.set(key, value);
            const result = await cacheService.get<string>(key);

            expect(result).toBe(value);
        });

        it('should return null for expired value from redis cache', async () => {
            const key = 'redisKey';
            const value = 'redisValue';
            await cacheService.set(key, value, 1);  // Set TTL to 1 second

            // Wait for 2 seconds to ensure the value has expired
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = await cacheService.get<string>(key);
            expect(result).toBeNull();
        });
    });

    describe('SQLite Cache Service', () => {
        beforeAll(() => {
            process.env.CACHE_TYPE = 'sqlite';
            cacheService = createCacheService();
        });

        it('should set and get value from sqlite cache', async () => {
            const key = 'sqliteKey';
            const value = 'sqliteValue';

            await cacheService.set(key, value);
            const result = await cacheService.get<string>(key);

            expect(result).toBe(value);
        });

        it('should return null for expired value from sqlite cache', async () => {
            const key = 'sqliteKey';
            const value = 'sqliteValue';
            await cacheService.set(key, value, 1);  // Set TTL to 1 second

            // Wait for 2 seconds to ensure the value has expired
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = await cacheService.get<string>(key);
            expect(result).toBeNull();
        });
    });
});
