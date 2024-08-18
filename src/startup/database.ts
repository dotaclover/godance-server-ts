import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import config from 'config';
import { initPostModel } from '../models/PostModel';

let sequelize: Sequelize | null = null;

const connectDatabase = async () => {
    const dbType = config.get<string>('database.type');

    if (dbType === 'mongodb') {
        const mongoUri = config.get<string>('database.mongodb.uri');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } else if (dbType === 'mysql') {
        const sequelizeConfig = config.get<any>('database.mysql');
        sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
            host: sequelizeConfig.host,
            port: sequelizeConfig.port,
            dialect: sequelizeConfig.dialect,
        });
        initPostModel(sequelize);
        await sequelize.sync();
        console.log('Connected to Sequelize (SQL)');
    } else {
        throw new Error(`Unsupported database type: ${dbType}`);
    }
};

const getSequelizeInstance = (): Sequelize | null => sequelize;

export { connectDatabase, getSequelizeInstance }