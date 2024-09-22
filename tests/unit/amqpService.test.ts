import config from '../../src/bootstrap/config';
import { AmqpService } from '../../src/services/amqpService';

describe('AmqpService', () => {
    let amqpService: AmqpService;
    const queueName = 'testQueue2';
    const testMessages = ['message1', 'message2', 'message3'];

    beforeAll(async () => {
        amqpService = new AmqpService(config.get('amqp.uri'));
        await amqpService.connect();
        await amqpService.deleteQueue(queueName);
        await amqpService.assertQueue(queueName);
    });

    afterAll(async () => {
        await amqpService.close();
    });

    it('should consume messages until the queue is empty', async () => {
        // 发送测试消息
        for (const message of testMessages) {
            await amqpService.sendToQueue(queueName, message);
        }

        // 使用 Promise 来处理消费
        const consumedMessages: string[] = [];
        await new Promise<void>((resolve) => {
            amqpService.consumeUntilEmpty(queueName, (msg) => {
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
