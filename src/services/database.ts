import config from 'config';
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';

let connected = false;
let sequelize: Sequelize | null = null;

const connectDatabase = async () => {

    if (connected) return sequelize;

    const dbType = config.get<string>('database.type');
    if (dbType === 'mongodb') {
        const mongoUri = config.get<string>('database.mongodb.uri');
        await mongoose.connect(mongoUri);

        connected = true;
        console.log('Connected to MongoDB');
    } else if (dbType === 'mysql') {
        const sequelizeConfig = config.get<any>('database.mysql');
        sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
            host: sequelizeConfig.host,
            port: sequelizeConfig.port,
            dialect: sequelizeConfig.dialect,
        });
        await sequelize.sync();

        connected = true;
        console.log('Connected to Sequelize (SQL)');
    } else if (["sqlite", "sqlite_memory"].includes(dbType)) {
        const sequelizeConfig = config.get<any>(`database.${dbType}`);
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: sequelizeConfig.storage
        });
        await sequelize.sync();

        connected = true;
        console.log('Connected to Sequelize (SQL)');
    } else
        throw new Error(`Unsupported database type: ${dbType}`);

};

const geDBInstance = async (): Promise<Sequelize> => {
    await connectDatabase();
    return sequelize!;
}
export { connectDatabase, geDBInstance }