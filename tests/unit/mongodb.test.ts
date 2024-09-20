import mongoose from 'mongoose';
import BaseMongo from '../../src/models/BaseMongo';
import config from '../../src/bootstrap/config';

describe('BaseMongo', () => {
  let TestModel: mongoose.Model<any>;
  let baseMongo: BaseMongo<any>;

  beforeAll(async () => {
    // 连接到 MongoDB 数据库
    await mongoose.connect(config.get("mongodb.uri"));

    // 创建一个测试用的模型
    const testSchema = new mongoose.Schema({
      name: String,
      age: Number,
    });
    TestModel = mongoose.model('Test', testSchema);

    // 初始化 BaseMongo 实例
    baseMongo = new BaseMongo<any>(TestModel);
  });

  beforeEach(async ()=>{
     // 清空测试数据
     await TestModel.deleteMany({});
  });

  afterAll(async () => {
    // 断开数据库连接
    await mongoose.connection.close();
  });

  it('should create a new document', async () => {
    const data = { name: 'John Doe', age: 30 };
    const createdDoc = await baseMongo.create(data);
    expect(createdDoc).toHaveProperty('_id');
    expect(createdDoc.name).toBe(data.name);
    expect(createdDoc.age).toBe(data.age);
  });

  it('should find all documents', async () => {
    await baseMongo.create({ name: 'Jane Doe', age: 25 });
    const docs = await baseMongo.getAll();
    expect(docs.length).toBeGreaterThan(0);
  });

  it('should find a document by id', async () => {
    const data = { name: 'Bob Smith', age: 40 };
    const createdDoc = await baseMongo.create(data);
    const foundDoc = await baseMongo.getById(createdDoc._id.toString());
    expect(foundDoc._id).toEqual(createdDoc._id);
  });

  it('should find documents with filtering, sorting, and pagination', async () => {
    await baseMongo.create({ name: 'Alice', age: 28 });
    await baseMongo.create({ name: 'Charlie', age: 32 });

    const query = TestModel.find({ age: { $gte: 30 } });
    const items = await query.exec();

    expect(items.length).toBe(1);
    expect(items[0].name).toBe('Charlie');
  });
});