import { Schema, model, Document } from 'mongoose';

interface IPost extends Document {
    userId: number;
    title: string;
    body: string;
}

const postSchema = new Schema<IPost>({
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
});

const PostMongo = model<IPost>('Post', postSchema);
export { PostMongo, IPost };
