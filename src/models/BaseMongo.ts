import { Model, Document } from 'mongoose';

class BaseMongo<T extends Document> {
    constructor(private model: Model<T>) { }

    async getAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async getById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        const createdDocument = await this.model.create(data);
        return createdDocument;
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }
}

export default BaseMongo;
