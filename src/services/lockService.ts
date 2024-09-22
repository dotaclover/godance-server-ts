
import redisService from "./redisService";

export class LockService {
    // 先请求独占锁，再设置过期时间
    async acquireLock(lockKey: string, lockValue: string, ttl: number): Promise<boolean> {
        const success = await redisService.setnx(lockKey, lockValue);
        if (success) {
            await redisService.setex(lockKey, lockValue, ttl);
            return true;
        }
        return false;
    }

    // 使用lockValue释放锁
    async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
        const currentValue = await redisService.getRaw(lockKey);
        if (currentValue === lockValue) {
            await redisService.delete(lockKey);
            return true;
        }
        return false;
    }

    // 强制释放锁
    async forceRelease(lockKey: string): Promise<void> {
        await redisService.delete(lockKey);
    }

    //延长锁时间
    async extendLock(lockKey: string, lockValue: string, ttl: number): Promise<boolean> {
        const currentValue = await redisService.getRaw(lockKey);
        if (currentValue == lockValue) {
            await redisService.setex(lockKey, lockValue, ttl);
            return true;
        }
        return false;
    }
}

const lockService = new LockService();
export default lockService;