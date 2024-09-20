import SequelizeCrud from '../../models/BaseSequelize';
import { TodoModel } from '../../models/TodoModel';

const todoService = new SequelizeCrud(TodoModel);
export default todoService;