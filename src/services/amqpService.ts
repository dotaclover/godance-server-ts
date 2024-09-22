import amqp, { Connection, Channel } from 'amqplib';
import config from '../bootstrap/config';

export class AmqpService {
    private connection!: Connection;
    private channel!: Channel;

    constructor(private uri: string) { }

    async connect(): Promise<void> {
        this.connection = await amqp.connect(this.uri);
        this.channel = await this.connection.createChannel();
    }

    async deleteQueue(queueName: string) {
        await this.channel.deleteQueue(queueName);
    }

    async assertQueue(queueName: string): Promise<void> {
        await this.channel.assertQueue(queueName, {
            durable: true,
        });
    }

    async sendToQueue(queueName: string, message: string): Promise<void> {
        await this.channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true,
        });
    }

    async consume(queueName: string, callback: (msg: amqp.Message | null) => void): Promise<void> {
        await this.channel.consume(queueName, async (msg) => {
            if (msg) {
                await callback(msg);
                await this.channel.ack(msg);
            }
        });
    }

    async consumeUntilEmpty(queueName: string, callback: (msg: amqp.Message | null) => void): Promise<void> {
        let msg;
        do {
            msg = await this.channel.get(queueName);
            if (msg) {
                await callback(msg);
                await this.channel.ack(msg);
            }
        } while (msg);
    }


    async close(): Promise<void> {
        await this.channel.close();
        await this.connection.close();
    }
}

const amqpService = new AmqpService(config.get('amqp.uri'));
export default amqpService;
