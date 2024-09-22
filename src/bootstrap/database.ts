import config from 'config';
import { Sequelize } from 'sequelize';

let connected = false;
let sequelize: Sequelize | null = null;

//连接数据库
export async function connectDatabase(type: string = ''): Promise<Sequelize> {
    if (connected) return sequelize!;

    const dbType = type || config.get<string>('database.type');

    const connect = async () => {
        if (dbType === 'mysql') {
            const sequelizeConfig = config.get<any>('database.mysql');
            sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
                host: sequelizeConfig.host,
                port: sequelizeConfig.port,
                dialect: sequelizeConfig.dialect,
                pool: {
                    max: sequelizeConfig.poolMax || 10, // 最大连接数
                    min: sequelizeConfig.poolMin || 0,  // 最小连接数
                    acquire: sequelizeConfig.acquire || 30000, // 获取连接的最大时间
                    idle: sequelizeConfig.idle || 10000,    // 连接空闲时间
                },
            });
        } else if (dbType === 'pgsql') {
            const sequelizeConfig = config.get<any>('database.pgsql');
            sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
                host: sequelizeConfig.host,
                port: sequelizeConfig.port,
                dialect: 'postgres',
                pool: {
                    max: sequelizeConfig.poolMax || 10,
                    min: sequelizeConfig.poolMin || 0,
                    acquire: sequelizeConfig.acquire || 30000,
                    idle: sequelizeConfig.idle || 10000,
                },
            });
        } else if (dbType === 'mssql') {
            const sequelizeConfig = config.get<any>('database.mssql');
            sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
                host: sequelizeConfig.host,
                port: sequelizeConfig.port,
                dialect: 'mssql',
                dialectOptions: sequelizeConfig.dialectOptions || {},
                pool: {
                    max: sequelizeConfig.poolMax || 10,
                    min: sequelizeConfig.poolMin || 0,
                    acquire: sequelizeConfig.acquire || 30000,
                    idle: sequelizeConfig.idle || 10000,
                },
            });
        } else if (["sqlite", "sqlite_memory"].includes(dbType)) {
            const sequelizeConfig = config.get<any>(`database.${dbType}`);
            sequelize = new Sequelize({
                dialect: "sqlite",
                storage: sequelizeConfig.storage,
                pool: {
                    max: sequelizeConfig.poolMax || 5,
                    min: sequelizeConfig.poolMin || 0,
                    acquire: sequelizeConfig.acquire || 30000,
                    idle: sequelizeConfig.idle || 10000,
                },
            });
        } else
            throw new Error(`Unsupported database type: ${dbType}`);

        //winston.info(`Connected to Sequelize (${dbType.toUpperCase()})`);

        connected = true;
        return sequelize;
    };

    return connect();
};

// 关闭连接
export async function closeDatabase() {
    if (connected && sequelize) {
        await sequelize.close();
        //winston.info("Sequelize connection closed");
        connected = false;
    }
};

// 获取当前数据库实例，如果未连接会自动重连
export async function getDBInstance(): Promise<Sequelize> {
    if (!connected)
        await connectDatabase();
    return sequelize!;
};

// 切换数据库类型，关闭之前的连接
export async function switchDatabaseType(newType: string): Promise<Sequelize> {
    await closeDatabase();
    return connectDatabase(newType);
};