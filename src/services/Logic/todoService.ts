import SequelizeCrud from '../library/SequelizeCrud';
import { TodoModel } from '../models/TodoModel';

const todoService = new SequelizeCrud(TodoModel);
export default todoService;