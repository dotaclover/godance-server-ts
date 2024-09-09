import IDataCrud from '../library/IDataCrud';
import MongoCrud from '../library/MongoCrud';
import { IPost, PostMongo } from '../mongo/PostMongo';

const createPostService = (): IDataCrud<IPost> => {
    return new MongoCrud(PostMongo);
}

export default createPostService();