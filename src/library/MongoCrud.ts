import { Model, Document } from 'mongoose';
import IDataCrud from './IDataCrud';

class MongoCrud<T extends Document> implements IDataCrud<T> {
    constructor(private model: Model<T>) { }

    async getAll() {
        return await this.model.find();
    }

    async getById(id: string) {
        return await this.model.findById(id);
    }

    async create(data: Partial<T>) {
        return await this.model.create(data);
    }

    async update(id: string, data: Partial<T>) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }
}

export default MongoCrud;