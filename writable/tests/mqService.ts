import config from 'config';
import { RedisQueueService } from './QueueService/RedisQueueService';
import { RabbitMQQueueService } from './QueueService/RabbitMQQueueService';
import { IQueueService } from './QueueService/IQueueService';
import { RedisOptions } from 'ioredis';

export interface QueueConfig {
    type: 'redis' | 'rabbitmq';
    redis: RedisOptions;
    rabbitmq: {
        url: string;
    };
}

const createQueueService = (): IQueueService<any> => {
    const queueConfig = config.get('queue') as QueueConfig;
    switch (queueConfig.type) {
        case 'rabbitmq':
            return new RabbitMQQueueService(queueConfig.rabbitmq.url);

        case 'redis':
        default:
            return new RedisQueueService(queueConfig.redis);

    }
};

export default createQueueService();
