import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

interface IMongoLog extends Document {
    userId: number;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: Date;
    meta?: Record<string, any>;
    service?: string;
    ip?: string;
    statusCode?: number;
}

const mongoLogSchema = new Schema<IMongoLog>({
    userId: Number,
    level: { type: String, enum: ['info', 'warn', 'error', 'debug'] },
    message: String,
    timestamp: { type: Date, default: Date.now },
    meta: Object,
    service: String,
    ip: String,
    statusCode: Number,
});

const MongoLogModel = mongoose.model<IMongoLog>('MongoLog', mongoLogSchema);

export { MongoLogModel, IMongoLog }
