import config from 'config';
import IDataCrud from './CrudService/IDataCrud';
import MongoCrud from './CrudService/MongoCrud';
import SequelizeCrud from './CrudService/SequelizeCrud';
import { PostModel } from '../models/PostModel';
import { PostMongo, IPost } from '../mongo/PostMongo';
import { getSequelizeInstance } from '../startup/database';

const createPostService = (): IDataCrud<PostModel | IPost> => {
    const dbType = config.get<string>('database.type');

    if (dbType === 'mongodb')
        return new MongoCrud(PostMongo);
    return new SequelizeCrud(PostModel);
}

export default createPostService();