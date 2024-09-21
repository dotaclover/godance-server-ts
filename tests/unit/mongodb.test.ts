import BaseMongo from '../../src/models/BaseMongo';
import { Document, model, Schema } from 'mongoose';
import config from '../../src/bootstrap/config';
import mongoose from 'mongoose';

// 继承 Document
interface TestDocument extends Document {
  _id: string;
  name: string;
  age: number;
}

const TestSchema = new Schema<TestDocument>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const TestModel = model<TestDocument>('Test', TestSchema);
const baseMongo = new BaseMongo<TestDocument>(TestModel);

beforeAll(async () => {
  await mongoose.connect(config.get('mongodb.uri'));
});

beforeEach(async ()=>{
  await baseMongo.deleteMany({});
})

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('BaseMongo', () => {
  it('should create a document', async () => {
    const data = { name: 'John Doe', age: 30 };
    const created = await baseMongo.create(data);
    expect(created).toHaveProperty('_id');
    expect(created.name).toBe(data.name);
    expect(created.age).toBe(data.age);
  });

  it('should get all documents', async () => {
    const data1 = { name: 'Alice', age: 25 };
    const data2 = { name: 'Bob', age: 40 };
    await baseMongo.create(data1);
    await baseMongo.create(data2);

    const result = await baseMongo.getAll();
    expect(result.length).toBe(2);
  });

  it('should get a document by ID', async () => {
    const data = { name: 'Charlie', age: 35 };
    const created = await baseMongo.create(data) as TestDocument;

    const result = await baseMongo.getById(created._id);
    expect(result).toBeDefined();
    expect(result?.name).toBe(data.name);
  });

  it('should update a document', async () => {
    const data = { name: 'Dave', age: 28 };
    const created = await baseMongo.create(data);

    const updatedData = { age: 29 };
    const updated = await baseMongo.update(created._id.toString(), updatedData);

    expect(updated).toBeDefined();
    expect(updated?.age).toBe(updatedData.age);
  });

  it('should delete a document', async () => {
    const data = { name: 'Eve', age: 22 };
    const created = await baseMongo.create(data);

    const deleted = await baseMongo.delete(created._id.toString());
    expect(deleted).toBeDefined();

    const result = await baseMongo.getById(created._id.toString());
    expect(result).toBeNull();
  });

  it('should find documents with pagination', async () => {
    const data1 = { name: 'Frank', age: 33 };
    const data2 = { name: 'Grace', age: 26 };
    const data3 = { name: 'Hank', age: 29 };

    await baseMongo.create(data1);
    await baseMongo.create(data2);
    await baseMongo.create(data3);

    const result = await baseMongo.find({ page: 1, pageSize: 2 });
    expect(result.items.length).toBe(2);
    expect(result.total).toBe(3);
  });

  it('should find documents by condition', async () => {
    const data1 = { name: 'Alice', age: 25 };
    const data2 = { name: 'Bob', age: 40 };
    const data3 = { name: 'Charlie', age: 25 };

    await baseMongo.create(data1);
    await baseMongo.create(data2);
    await baseMongo.create(data3);

    const condition = { filter: { age: 25 } };
    const result = await baseMongo.find(condition);
    expect(result.items.length).toBe(2); // 校验返回的文档数量
    expect(result.total).toBe(2); // 校验总条数
    expect(result.items.every(doc => doc.age === 25)).toBe(true);
  });
});
