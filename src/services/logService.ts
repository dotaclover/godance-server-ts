import mongoose from 'mongoose';
import config from '../bootstrap/config';
import BaseMongo from '../models/BaseMongo';
import { ILog, LogModel } from '../models/LogModel';

export async function initLogService() {
    await mongoose.connect(config.get("mongodb.uri"));
}

const logService = new BaseMongo<ILog>(LogModel);
export default logService;