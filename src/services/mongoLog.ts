
import BaseMongo from '../models/BaseMongo';
import { IMongoLog, MongoLogModel } from '../models/MongoLogModel';

const mongoLog = new BaseMongo<IMongoLog>(MongoLogModel);
export default mongoLog;