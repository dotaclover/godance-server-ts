import IDataCrud from '../library/IDataCrud';
import SequelizeCrud from '../library/SequelizeCrud';
import { TodoModel } from '../models/TodoModel';

const createTodoService = (): IDataCrud<TodoModel> => {
    return new SequelizeCrud(TodoModel);
}

export default createTodoService();
