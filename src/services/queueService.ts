import redisService from './redisService';

export class QueueService {

    async push(queueName: string, value: string): Promise<void> {
        await redisService.enqueue(queueName, value);
    }

    async pop(queueName: string): Promise<string | null> {
        return redisService.dequeue(queueName);
    }

    async length(queueName: string): Promise<number> {
        return redisService.queueLength(queueName);
    }

    async peek(queueName: string): Promise<string | null> {
        const items = await redisService.peek(queueName);
        return items.length > 0 ? items[0] : null;
    }

    async clear(key: string): Promise<void> {
        await redisService.delete(key);
    }
}

const queueService = new QueueService();
export default queueService;