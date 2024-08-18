import amqp from 'amqplib';
import { IQueueService } from './IQueueService';

export class RabbitMQQueueService implements IQueueService<any> {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    constructor(private url: string) {
        // 连接 RabbitMQ 并创建通道
        this.init();
    }

    private async init() {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
    }

    async enqueue(queueName: string, item: any): Promise<void> {
        await this.channel.assertQueue(queueName);
        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(item)));
    }

    async dequeue(queueName: string): Promise<any | null> {
        const msg = await this.channel.get(queueName);
        if (msg) {
            this.channel.ack(msg);
            return JSON.parse(msg.content.toString());
        }
        return null;
    }

    async peek(queueName: string): Promise<any | null> {
        // RabbitMQ 不直接支持 peek 操作
        // 可能需要实现特定的策略，如从一个临时队列中读取消息
        return null;
    }

    async size(queueName: string): Promise<number> {
        // RabbitMQ 没有直接的队列大小 API，可以通过管理插件获取
        return 0;
    }

    async purge(queueName: string): Promise<void> {
        await this.channel.purgeQueue(queueName);
    }
}
