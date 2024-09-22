import { QueueService } from '../../src/services/queueService';
import redisService from '../../src/services/redisService';

describe('QueueService', () => {
    let queueService: QueueService;

    const queueName = 'godanceQueue';
    const value = 'godanceValue';

    beforeEach(() => {
        queueService = new QueueService();
    });

    afterEach(async () => {
        await queueService.clear(queueName);
    });

    afterAll(async () => {
        await redisService.disconnect();
    });

    it('should push, pop, and check length', async () => {
        await queueService.push(queueName, value);
        const poppedValue = await queueService.pop(queueName);
        const length = await queueService.length(queueName);

        expect(poppedValue).toBe(value);
        expect(length).toBe(0);
    });

    it('should peek at the first value', async () => {
        await queueService.push(queueName, value);
        const peekedValue = await queueService.peek(queueName);

        expect(peekedValue).toBe(value);
    });
});