import { Redis, RedisOptions } from 'ioredis';
import os from 'os';
import { IQueueService } from './IQueueService';
import config from 'config';

interface RedisQueueServiceOptions extends RedisOptions {
    groupName?: string;
    consumerName?: string;
}

export class RedisQueueService<T> implements IQueueService<T> {
    private client: Redis;
    private groupName: string;
    private consumerName: string;

    constructor(options: RedisQueueServiceOptions) {
        this.client = new Redis(options);
        this.groupName = options?.groupName || config.get("app_name");
        this.consumerName = options?.consumerName || this.getMachineIp();
    }

    private getMachineIp(): string {
        const interfaces = os.networkInterfaces();
        for (const key in interfaces) {
            for (const iface of interfaces[key]!) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
        return 'localhost';
    }

    async enqueue(queueName: string, item: T): Promise<void> {
        await this.client.xadd(queueName, '*', 'data', JSON.stringify(item));
    }

    async dequeue(queueName: string): Promise<T | null> {
        const result = await this.client.xreadgroup(
            'GROUP', this.groupName, this.consumerName,
            'STREAMS', queueName, '>',
            'COUNT', 1
        ) as [string, [string, string[]][]][];

        if (result.length > 0) {
            const [stream, entries] = result[0];
            const [id, fields] = entries[0];
            const item = JSON.parse(fields[1]);
            await this.client.xack(queueName, this.groupName, id);
            return item as T;
        }
        return null;
    }

    async peek(queueName: string): Promise<T | null> {
        const result = await this.client.xrange(queueName, '-', '+', 'COUNT', 1);
        if (result.length > 0) {
            const [, fields] = result[0];
            return JSON.parse(fields[1]) as T;
        }
        return null;
    }

    async size(queueName: string): Promise<number> {
        return await this.client.xlen(queueName);
    }

    async purge(queueName: string): Promise<void> {
        await this.client.del(queueName);
    }
}
