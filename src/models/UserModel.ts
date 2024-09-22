import { DataTypes, Model } from 'sequelize';
import { getDBInstance } from '../bootstrap/database';

export class UserModel extends Model {
    public id!: number;
    public status!: number;
    public isAdmin!: boolean;
    public username!: string;
    public password!: string;
}

export async function initUserModel() {
    const sequelize = await getDBInstance();
    UserModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            status: {
                type: DataTypes.TINYINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                field: "is_admin",
                allowNull: false,
            },
            username: {
                type: new DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            password: {
                type: new DataTypes.STRING(20),
                allowNull: false,
            },
        },
        {
            tableName: 'users',
            timestamps: true,
            underscored: true,
            sequelize,
        }
    );
}

//
initUserModel();