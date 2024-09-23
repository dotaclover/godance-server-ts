import { Database } from 'sqlite3';

interface CacheRow {
    key: string;
    value: string;
    expireAt: number;
}
class SQLiteCacheService implements ICacheService {
    private db: Database;

    constructor(dbPath: string) {
        this.db = new Database(dbPath);
        this.initialize();
    }

    private initialize() {
        this.db.run(`CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT, expireAt INTEGER)`);
    }

    async get<T>(key: string): Promise<T | null> {
        return new Promise((resolve, reject) => {
            this.db.get<CacheRow>(
                `SELECT value, expireAt FROM cache WHERE key = ?`,
                [key],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);
                    if (row.expireAt && row.expireAt < Date.now()) {
                        this.db.run(`DELETE FROM cache WHERE key = ?`, [key]);
                        return resolve(null);
                    }
                    return resolve(JSON.parse(row.value));
                }
            );
        });
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const expireAt = ttl ? Date.now() + ttl * 1000 : null;
        const serializedValue = JSON.stringify(value);
        this.db.run(
            `INSERT INTO cache (key, value, expireAt) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, expireAt = excluded.expireAt`,
            [key, serializedValue, expireAt]
        );
    }
}


export default SQLiteCacheService;