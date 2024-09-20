import mongoose from 'mongoose';
import logService, { initLogService } from '../../src/services/logService';  // 确保路径正确
import { ILog, LogModel } from '../../src/models/LogModel';

describe('LogService', () => {
    beforeAll(async () => {
        await initLogService();
        await LogModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new log entry', async () => {
        const logData: Partial<ILog> = {
            userId: 1,
            level: 'info',
            message: 'Test log message',
            timestamp: new Date(),
            meta: { action: 'test' },
            service: 'TestService',
            ip: '127.0.0.1',
            statusCode: 200
        };

        const log = await logService.create(logData);
        expect(log).toHaveProperty('_id');
        expect(log.userId).toBe(logData.userId);
        expect(log.level).toBe(logData.level);
    });

    it('should retrieve all logs', async () => {
        const logs = await logService.getAll();
        expect(logs.length).toBeGreaterThan(0);
    });

    it('should retrieve a log by id', async () => {
        const logData: Partial<ILog> = {
            userId: 2,
            level: 'error',
            message: 'Another test log message',
            timestamp: new Date(),
            service: 'AnotherService',
            ip: '192.168.1.1',
            statusCode: 500
        };

        const newLog = await logService.create(logData);
        const retrievedLog = await logService.getById(newLog._id as string);

        expect(retrievedLog).toBeTruthy();
        expect(retrievedLog?.message).toBe(logData.message);
    });

    it('should update a log entry', async () => {
        const logData: Partial<ILog> = {
            userId: 3,
            level: 'warn',
            message: 'Log to update',
            timestamp: new Date()
        };

        const createdLog = await logService.create(logData);
        const updatedLog = await logService.update(createdLog._id as string, { message: 'Updated message' });

        expect(updatedLog).toBeTruthy();
        expect(updatedLog?.message).toBe('Updated message');
    });

    it('should delete a log entry', async () => {
        const logData: Partial<ILog> = {
            userId: 4,
            level: 'debug',
            message: 'Log to delete',
            timestamp: new Date()
        };

        const logToDelete = await logService.create(logData);
        const deletedLog = await logService.delete(logToDelete._id as string);

        const foundLog = await logService.getById(logToDelete._id as string);
        expect(foundLog).toBeNull();  // 确保已经被删除
    });
});
