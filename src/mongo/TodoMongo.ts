import { Schema, model, Document } from 'mongoose';

interface ITodo extends Document {
    userId: number;
    title: string;
    completed: boolean;
}

const todoSchema = new Schema<ITodo>({
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true }
});

const TodoMongo = model<ITodo>('Todo', todoSchema);

export { TodoMongo, ITodo }
