import redisService from '../../src/services/redisService';

describe('RedisService', () => {

    it('should set and get a value', async () => {
        const key = 'test-key';
        const value = { some: 'data' };

        await redisService.set(key, value);

        const result = await redisService.get<typeof value>(key);
        expect(result).toEqual(value);
    });

    it('should set a value with TTL and get the value', async () => {
        const key = 'test-key-with-ttl';
        const value = { some: 'data' };
        const ttl = 60;

        await redisService.set(key, value, ttl);

        const result = await redisService.get<typeof value>(key);
        expect(result).toEqual(value);
    });

    it('should delete a key', async () => {
        const key = 'test-key-to-delete';
        const value = 'delete-me';

        await redisService.set(key, value);
        await redisService.delete(key);

        const result = await redisService.get(key);
        expect(result).toBeNull();
    });

    it('should enqueue and dequeue from a queue', async () => {
        const queueName = 'test-queue';
        const value = 'queued-value';

        await redisService.enqueue(queueName, value);
        const dequeuedValue = await redisService.dequeue(queueName);

        expect(dequeuedValue).toBe(value);
    });

    it('should return queue length', async () => {
        const queueName = 'test-queue-length';

        await redisService.enqueue(queueName, 'value1');
        await redisService.enqueue(queueName, 'value2');

        const length = await redisService.queueLength(queueName);

        expect(length).toBe(2);
    });

    it('should add and remove values from a set', async () => {
        const setName = 'test-set';
        const value = 'set-value';

        await redisService.sadd(setName, value);
        const members = await redisService.smembers(setName);

        expect(members).toContain(value);

        await redisService.srem(setName, value);
        const updatedMembers = await redisService.smembers(setName);

        expect(updatedMembers).not.toContain(value);
    });

    it('should handle map operations', async () => {
        const mapName = 'test-map';
        const key = 'map-key';
        const value = 'map-value';

        await redisService.hset(mapName, key, value);
        const result = await redisService.hget(mapName, key);

        expect(result).toBe(value);

        await redisService.hdel(mapName, key);
        const deletedResult = await redisService.hget(mapName, key);

        expect(deletedResult).toBeNull();
    });
});
