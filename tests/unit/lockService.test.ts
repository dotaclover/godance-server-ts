import lockService from '../../src/services/lockService';
import redisService from '../../src/services/redisService';

beforeAll(async () => {
    await redisService.connect();
});

afterAll(async () => {
    await redisService.flushDB();
    await redisService.disconnect();
});

describe('LockService', () => {
    const lockKey = 'test-lock';
    const lockValue = '12345';
    const ttl = 5; // TTL in seconds

    it('should acquire a lock successfully', async () => {
        const result = await lockService.acquireLock(lockKey, lockValue, ttl);
        expect(result).toBe(true);

        const storedValue = String(await redisService.getRaw(lockKey));
        expect(storedValue).toBe(lockValue);
    });

    it('should not acquire a lock if it already exists', async () => {
        const result = await lockService.acquireLock(lockKey, lockValue, ttl);
        expect(result).toBe(false);
    });

    it('should release a lock successfully', async () => {
        const result = await lockService.releaseLock(lockKey, lockValue);
        expect(result).toBe(true); // Expect successful release

        const storedValue = await redisService.getRaw(lockKey);
        expect(storedValue).toBeNull(); // Lock should be deleted
    });

    it('should not release a lock if the value does not match', async () => {
        await lockService.acquireLock(lockKey, lockValue, ttl);

        const result = await lockService.releaseLock(lockKey, 'wrong-value');
        expect(result).toBe(false); // Lock should not be released

        const storedValue = await redisService.getRaw(lockKey);
        expect(storedValue).toBe(lockValue); // Lock should still exist
    });

    it('should forcefully release a lock', async () => {
        await lockService.acquireLock(lockKey, lockValue, ttl);

        await lockService.forceRelease(lockKey);

        const storedValue = await redisService.getRaw(lockKey);
        expect(storedValue).toBeNull(); // Lock should be deleted
    });

    it('should extend a lock successfully', async () => {
        await lockService.acquireLock(lockKey, lockValue, ttl);

        const result = await lockService.extendLock(lockKey, lockValue, 10);
        expect(result).toBe(true); // Lock should be extended

        const storedValue = await redisService.getRaw(lockKey);
        expect(storedValue).toBe(lockValue); // Lock should still exist
    });

    it('should not extend a lock if the value does not match', async () => {
        const result = await lockService.extendLock(lockKey, 'wrong-value', 10);
        expect(result).toBe(false); // Lock should not be extended
    });
});
