import { Schema, model, Document } from 'mongoose';

interface ILog extends Document {
    userId: number;
    level: 'info' | 'warn' | 'error' | 'debug'; // Log level
    message: string;                             // Main log message
    timestamp: Date;                             // Time of the log event
    meta?: Record<string, any>;                  // Additional metadata for context (optional)
    service?: string;                            // The service/module generating the log (optional)
    ip?: string;                                 // IP address of the user or request (optional)
    statusCode?: number;                         // HTTP status code, if relevant (optional)
}

const logSchema = new Schema<ILog>({
    userId: { type: Number, required: true },
    level: { type: String, enum: ['info', 'warn', 'error', 'debug'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    service: { type: String },
    ip: { type: String },
    statusCode: { type: Number }
});

const LogModel = model<ILog>('Log', logSchema);

export { LogModel, ILog };
