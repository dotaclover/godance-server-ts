import config from 'config';
import { Sequelize } from 'sequelize';

let connected = false;
let sequelize: Sequelize | null = null;

const connectDatabase = async (type: string = ''): Promise<Sequelize> => {
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
        } else {
            throw new Error(`Unsupported database type: ${dbType}`);
        }

        await sequelize.sync();
        connected = true;
        console.log(`Connected to Sequelize (${dbType.toUpperCase()})`);
        return sequelize;
    };

    return connect();
};

// 关闭连接
const closeDatabase = async () => {
    if (connected && sequelize) {
        await sequelize.close();
        connected = false;
        console.log('Sequelize connection closed');
    }
};

// 获取当前数据库实例，如果未连接会自动重连
const getDBInstance = async (): Promise<Sequelize> => {
    if (!connected) {
        await connectDatabase();
    }
    return sequelize!;
};

// 切换数据库类型并关闭之前的连接
const switchDatabaseType = async (newType: string): Promise<Sequelize> => {
    // 关闭现有连接
    await closeDatabase();

    // 使用新的数据库类型重新连接
    return connectDatabase(newType);
};

export { connectDatabase, closeDatabase, getDBInstance, switchDatabaseType };
