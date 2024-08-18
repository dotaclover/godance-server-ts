import { initPostModel } from "../models/PostModel";
import { initTodoModel } from "../models/TodoModel";
import { getSequelizeInstance } from "../startup/database";

function initialServices() {
    const sequelize = getSequelizeInstance();
    if (!sequelize) return;
    initPostModel(sequelize);
    initTodoModel(sequelize);
}

export default initialServices;