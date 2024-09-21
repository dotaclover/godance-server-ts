import { Sequelize, DataTypes, Model, Op } from 'sequelize';
import BaseSequelize from '../../src/models/BaseSequelize';
import { connectDatabase, closeDatabase } from '../../src/bootstrap/database';

// 定义测试模型
class TestModel extends Model {
    declare id: number;
    declare name: string;
}

// 初始化数据库连接
let sequelize: Sequelize;
let baseSequelize: BaseSequelize<TestModel>;

beforeAll(async () => {
    sequelize = await connectDatabase('sqlite_memory');
    TestModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { sequelize, modelName: 'TestModel' });

    // 同步数据库，创建表
    await sequelize.sync({ force: true });

    // 初始化 BaseSequelize 实例
    baseSequelize = new BaseSequelize(TestModel);
});

afterAll(async () => {
    // 删除表并关闭数据库连接
    await sequelize.drop();
    await closeDatabase();
});

describe('BaseSequelize CRUD operations', () => {
    it('should create a new record', async () => {
        const record = await baseSequelize.create({ name: 'Test Name' });
        expect(record).toBeDefined();
        expect(record.name).toBe('Test Name');
    });

    it('should retrieve a record by ID', async () => {
        const record = await baseSequelize.create({ name: 'Another Name' });
        const foundRecord = await baseSequelize.getById(record.id);
        expect(foundRecord).toBeDefined();
        expect(foundRecord!.name).toBe('Another Name');
    });

    it('should update a record', async () => {
        const record = await baseSequelize.create({ name: 'Old Name' });
        const updatedRecord = await baseSequelize.update(record.id, { name: 'Updated Name' });
        expect(updatedRecord).toBeDefined();
        expect(updatedRecord!.name).toBe('Updated Name');
    });

    it('should delete a record', async () => {
        const record = await baseSequelize.create({ name: 'To Be Deleted' });
        const deletedRecord = await baseSequelize.delete(record.id);
        expect(deletedRecord).toBeDefined();
        expect(deletedRecord!.name).toBe('To Be Deleted');

        const foundRecord = await baseSequelize.getById(record.id);
        expect(foundRecord).toBeNull();
    });

    it('should query with filters, sorting, and pagination', async () => {
        // 创建多个记录
        await baseSequelize.create({ name: 'GoDance 1' });
        await baseSequelize.create({ name: 'GoDance 2' });
        await baseSequelize.create({ name: 'GoDance 3' });

        // 使用分页查询
        const { rows, count } = await baseSequelize.queryWithFilters(
            {
                name:{
                    [Op.like]:"GoDance%"
                }
            },
            undefined,
            [['name', 'ASC']],
            2,
            0
        );

        expect(count).toBe(3);
        expect(rows.length).toBe(2);
        expect(rows[0].name).toBe('GoDance 1');
    });
});
