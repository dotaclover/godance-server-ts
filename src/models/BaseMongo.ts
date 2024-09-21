import { Model, Document, FilterQuery } from 'mongoose';

interface FindOptions<T extends Document> {
    filter?: FilterQuery<T>; // 使用 FilterQuery<T> 更明确类型
    sort?: string | { [key: string]: 1 | -1 }; // 简化 sort 类型
    page?: number;
    pageSize?: number;
}

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

    async deleteMany(filter: FilterQuery<T>){
        return await this.model.deleteMany(filter);
    }

    async find(options: FindOptions<T>): Promise<{ items: T[]; total: number }> {
        const filter = options.filter ?? {};
        const query = this.model.find(filter); // 用于获取结果的查询
        const countQuery = this.model.countDocuments(filter); // 用于获取总数的查询
    
        if (options.sort) query.sort(options.sort);
    
        if (options.page && options.pageSize) {
            const skip = (options.page - 1) * options.pageSize;
            query.skip(skip).limit(options.pageSize);
        }
    
        const [items, total] = await Promise.all([query.exec(), countQuery.exec()]); // 独立执行
    
        return { items, total };
    }
    
}

export default BaseMongo;