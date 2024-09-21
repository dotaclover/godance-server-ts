import config from '../../src/bootstrap/config';
import { RabbitMQService } from '../../src/services/rabbitService';

describe('RabbitMQService', () => {
    let rabbitMQService: RabbitMQService;
    const queueName = 'testQueue2';
    const testMessages = ['message1', 'message2', 'message3'];

    beforeAll(async () => {
        rabbitMQService = new RabbitMQService(config.get('amqp.uri'));
        await rabbitMQService.connect();
        await rabbitMQService.deleteQueue(queueName);
        await rabbitMQService.assertQueue(queueName);
    });

    afterAll(async () => {
        await rabbitMQService.close();
    });

    it('should consume messages until the queue is empty', async () => {
        // 发送测试消息
        for (const message of testMessages) {
            await rabbitMQService.sendToQueue(queueName, message);
        }

        // 使用 Promise 来处理消费
        const consumedMessages: string[] = [];
        await new Promise<void>((resolve) => {
            rabbitMQService.consumeUntilEmpty(queueName, (msg) => {
                if (msg) {
                    consumedMessages.push(msg.content.toString());
                }
            });

            // 设定一个超时，确保测试不会无限挂起
            setTimeout(() => {
                resolve();
            }, 1000);
        });

        // 验证消息
        expect(consumedMessages).toEqual(testMessages);
    });
});
