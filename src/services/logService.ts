import BaseMongo from '../models/BaseMongo';
import { LogModel } from '../models/LogModel';

const logService = new BaseMongo(LogModel);
export default logService;