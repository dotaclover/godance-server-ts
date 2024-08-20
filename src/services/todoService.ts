import config from 'config';
import IDataCrud from './CrudService/IDataCrud';
import MongoCrud from './CrudService/MongoCrud';
import SequelizeCrud from './CrudService/SequelizeCrud';
import { TodoModel } from '../models/TodoModel';
import { TodoMongo, ITodo } from '../mongo/TodoMongo';

const createTodoService = (): IDataCrud<TodoModel | ITodo> => {
    const dbType = config.get<string>('database.type');

    if (dbType === 'mongodb')
        return new MongoCrud(TodoMongo);

    return new SequelizeCrud(TodoModel);
}

export default createTodoService();
