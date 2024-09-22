import mongoose from 'mongoose';
import config from '../bootstrap/config';
export async function initMongoDB() {
    await mongoose.connect(config.get("mongodb.uri"));
}