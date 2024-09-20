import mongoose from 'mongoose';
import config from '../bootstrap/config';
import BaseMongo from '../models/BaseMongo';
import { LogModel } from '../models/LogModel';

export async function initLogService() {
    await mongoose.connect(config.get("mongodb.uri"));
}

const logService = new BaseMongo(LogModel);
export default logService;