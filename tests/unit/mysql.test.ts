import { Sequelize, DataTypes, Model, Op } from 'sequelize';
import SequelizeCrud from '../../src/models/BaseSequelize';
import { connectDatabase, closeDatabase } from '../../src/bootstrap/database';

class TestModel extends Model {
    declare id: number;
    declare name: string;
}

let sequelize: Sequelize;
let testModel: SequelizeCrud<TestModel> = new SequelizeCrud(TestModel);

beforeAll(async () => {
    sequelize = await connectDatabase('mysql');
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

    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await testModel.dropTable();
    await closeDatabase();
});

describe('testModel CRUD operations', () => {
    it('should create a new record', async () => {
        const record = await testModel.create({ name: 'Test Name' });
        expect(record).toBeDefined();
        expect(record.name).toBe('Test Name');
    });

    it('should retrieve a record by ID', async () => {
        const record = await testModel.create({ name: 'Another Name' });
        const foundRecord = await testModel.getById(record.id);
        expect(foundRecord).toBeDefined();
        expect(foundRecord!.name).toBe('Another Name');
    });

    it('should update a record', async () => {
        const record = await testModel.create({ name: 'Old Name' });
        const updatedRecord = await testModel.update(record.id, { name: 'Updated Name' });
        expect(updatedRecord).toBeDefined();
        expect(updatedRecord!.name).toBe('Updated Name');
    });

    it('should delete a record', async () => {
        const record = await testModel.create({ name: 'To Be Deleted' });
        const deletedRecord = await testModel.delete(record.id);
        expect(deletedRecord).toBeDefined();
        expect(deletedRecord!.name).toBe('To Be Deleted');

        const foundRecord = await testModel.getById(record.id);
        expect(foundRecord).toBeNull();
    });

    it('should query with filters, sorting, and pagination', async () => {

        await testModel.create({ name: 'GoDance 1' });
        await testModel.create({ name: 'GoDance 2' });
        await testModel.create({ name: 'GoDance 3' });

        const { rows, count } = await testModel.queryWithFilters(
            {
                name: {
                    [Op.like]: "GoDance%"
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
