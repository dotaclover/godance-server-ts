import { DataTypes, Model, Sequelize } from 'sequelize';

class PostModel extends Model {
    public id!: number;
    public userId!: number;
    public title!: string;
    public body!: string;
}

function initPostModel(sequelize: Sequelize) {
    PostModel.init(
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
            body: {
                type: new DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'posts',
            sequelize,
        }
    );
}

export { PostModel, initPostModel }