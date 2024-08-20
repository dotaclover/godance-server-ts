interface IQueueService<T> {
    enqueue(queueName: string, item: T): Promise<void>;
    dequeue(queueName: string): Promise<T | null>;
    peek(queueName: string): Promise<T | null>;
    size(queueName: string): Promise<number>;
    purge(queueName: string): Promise<void>;
}

export { IQueueService }; 