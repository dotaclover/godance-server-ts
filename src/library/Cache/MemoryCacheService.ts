class MemoryCacheService implements ICacheService {
    private cache = new Map<string, { value: any; expireAt: number | null }>();

    async get<T>(key: string): Promise<T | null> {
        const item = this.cache.get(key);
        if (!item) return null;
        if (item.expireAt && item.expireAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const expireAt = ttl ? Date.now() + ttl * 1000 : null;
        this.cache.set(key, { value, expireAt });
    }
}


export default MemoryCacheService;