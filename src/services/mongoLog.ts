
import BaseMongo from '../models/BaseMongo';
import { ILog, LogModel } from '../models/LogModel';

const mongoLog = new BaseMongo<ILog>(LogModel);
export default mongoLog;