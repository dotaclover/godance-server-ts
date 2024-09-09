interface IDataCrud<T> {
    getAll(): Promise<T[]>;
    getById(id: string | number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T | null>;
    delete(id: string | number): Promise<T | null>;
}
export default IDataCrud;
