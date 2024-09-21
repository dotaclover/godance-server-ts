import { FindOptions, Model, ModelStatic, Order, WhereOptions } from 'sequelize';

class BaseSequelize<T extends Model> {
    constructor(private model: ModelStatic<T>) { }

    async getAll(options: FindOptions = {}): Promise<T[]> {
        const instances = await this.model.findAll(options);
        return instances as T[];
    }

    async getById(id: number): Promise<T | null> {
        const instance = await this.model.findByPk(id);
        return instance as T | null;
    }

    async find(options: FindOptions = {}): Promise<T | null> {
        const instance = await this.model.findOne(options);
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

    async queryWithFilters(
        where: WhereOptions<T> = {},
        group?: string | string[], // Modified the type here
        order: Order = [['id', 'ASC']],
        limit: number = 10,
        offset: number = 0
    ): Promise<{ rows: T[], count: number }> {
        const options: FindOptions = {
            where,
            order,
            limit,
            offset
        };

        if (group) // Ensure the group is set only if it's provided
            options.group = group;

        const { rows, count } = await this.model.findAndCountAll(options);
        return { rows, count };
    }
}

export default BaseSequelize;
