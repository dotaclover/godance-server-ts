import { Model, ModelStatic } from 'sequelize';
import IDataCrud from './IDataCrud';

class SequelizeCrud<T extends Model> implements IDataCrud<T> {
    constructor(private model: ModelStatic<T>) { }

    async getAll(): Promise<T[]> {
        const instances = await this.model.findAll();
        return instances as T[];
    }

    async getById(id: number): Promise<T | null> {
        const instance = await this.model.findByPk(id);
        return instance as T | null;
    }

    async create(data: Partial<T['_creationAttributes']>): Promise<T> {
        const instance = await this.model.create(data as T['_creationAttributes']);
        return instance as T;
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        const instance = await this.model.findByPk(id);
        if (instance) {
            await instance.update(data);
            return instance as T;
        }
        return null;
    }

    async delete(id: number): Promise<T | null> {
        const instance = await this.model.findByPk(id);
        if (instance) {
            await instance.destroy();
            return instance as T;
        }
        return null;
    }
}

export default SequelizeCrud;