import config from 'config';
import IDataCrud from './CrudService/IDataCrud';
import MongoCrud from './CrudService/MongoCrud';
import SequelizeCrud from './CrudService/SequelizeCrud';
import { PostModel, initPostModel } from '../models/PostModel';
import { PostMongo, IPost } from '../mongo/PostMongo';
import { getSequelizeInstance } from '../startup/database';

const createPostService = (): IDataCrud<PostModel | IPost> => {
    const dbType = config.get<string>('database.type');

    if (dbType === 'mongodb')
        return new MongoCrud(PostMongo);

    if (dbType === 'sequelize') {
        const sequelize = getSequelizeInstance();
        if (!sequelize)
            throw new Error('Sequelize instance not initialized');

        // Initialize the PostModel with the sequelize instance
        initPostModel(sequelize);
        return new SequelizeCrud(PostModel);
    }

    throw new Error(`Unsupported database type: ${dbType}`);
}

export default createPostService();
