import SequelizeCrud from '../library/SequelizeCrud';
import { UserModel } from '../models/UserModel';

const userService = new SequelizeCrud(UserModel);
export default userService;
