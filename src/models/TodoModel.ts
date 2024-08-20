import { DataTypes, Model, Sequelize } from 'sequelize';
import { geDBInstance } from '../services/database';

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
    )
})

export { TodoModel }