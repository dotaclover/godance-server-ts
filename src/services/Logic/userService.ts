import { ModelStatic } from 'sequelize';
import SequelizeCrud from '../../models/BaseSequelize';
import { UserModel } from '../../models/UserModel';

class UserService extends SequelizeCrud<UserModel> {

    constructor(model: ModelStatic<UserModel>) {
        super(model);
    }

    async activate(id: number) {
        return await this.update(id, { status: 1 });
    }

    async suspend(id: number) {
        return await this.update(id, { status: 0 });
    }

}
const userService = new UserService(UserModel);
export default userService;
