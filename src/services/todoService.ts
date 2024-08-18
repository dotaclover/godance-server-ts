import config from 'config';
import IDataCrud from './CrudService/IDataCrud';
import MongoCrud from './CrudService/MongoCrud';
import SequelizeCrud from './CrudService/SequelizeCrud';
import { TodoModel, initTodoModel } from '../models/TodoModel';
import { TodoMongo, ITodo } from '../mongo/TodoMongo';
import { getSequelizeInstance } from '../startup/database';

const createTodoService = (): IDataCrud<TodoModel | ITodo> => {
    const dbType = config.get<string>('database.type');

    if (dbType === 'mongodb')
        return new MongoCrud(TodoMongo);

    if (dbType === 'sequelize') {
        const sequelize = getSequelizeInstance();
        if (!sequelize)
            throw new Error('Sequelize instance not initialized');

        // Initialize the TodoModel with the sequelize instance
        initTodoModel(sequelize);
        return new SequelizeCrud(TodoModel);
    }

    throw new Error(`Unsupported database type: ${dbType}`);
}

export default createTodoService();
