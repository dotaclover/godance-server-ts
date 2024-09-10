import { DataTypes, Model, Sequelize } from 'sequelize';
import { geDBInstance } from '../services/database';
import config from 'config';

class TodoModel extends Model {
    public id!: number;
    public userId!: number;
    public title!: string;
    public completed!: boolean;
}

geDBInstance().then((sequelize: Sequelize) => {
    TodoModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "user_id",
                allowNull: false,
            },
            title: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            tableName: 'todos',
            sequelize,
        }
    );

    if (config.util.getEnv("NODE_ENV") === "development")
        sequelize.sync();
})

export { TodoModel }