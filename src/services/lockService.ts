
import redisService from "./redisService";

export class LockService {
    // Acquire a lock with a timeout (in seconds)
    async acquireLock(lockKey: string, lockValue: string, ttl: number): Promise<boolean> {
        // Try to set the lock using SET NX (if not exists) with expiration (EX)
        const success = await redisService.setnx(lockKey, lockValue);
        if (success) {
            // Set the expiration for the lock
            await redisService.setex(lockKey, lockValue, ttl);
            return true;
        }
        return false; // Lock already exists
    }

    // Release the lock
    async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
        const currentValue = await redisService.get<string>(lockKey);
        // Only release the lock if the lock value matches
        if (currentValue === lockValue) {
            await redisService.delete(lockKey);
            return true;
        }
        return false; // Lock does not exist or value does not match
    }

    // Forcefully release a lock (if needed)
    async forceRelease(lockKey: string): Promise<void> {
        await redisService.delete(lockKey);
    }

    // Extend lock time (useful if the process holding the lock needs more time)
    async extendLock(lockKey: string, lockValue: string, ttl: number): Promise<boolean> {
        const currentValue = await redisService.get<string>(lockKey);
        if (currentValue === lockValue) {
            // Reset the TTL for the lock
            await redisService.setex(lockKey, lockValue, ttl);
            return true;
        }
        return false; // Lock does not exist or value does not match
    }
}

const lockService = new LockService();
export default lockService;