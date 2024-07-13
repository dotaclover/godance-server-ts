import mongoose, { Document, Schema, Model } from "mongoose";
import connect from "../services/mongo/connect";
import Database from "../services/mongo/database";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
const database = new Database();

async function run() {
    //选连接MongoDB
    await connect();

    // 创建用户
    const newUser = await database.create(User, {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
    });
    console.log("Created User:", newUser);

    // 获取单个用户
    const user = await database.getOne(User, { email: "john@example.com" });
    console.log("Fetched User:", user);

    // 获取用户列表
    const users = await database.getList(User, {});
    console.log("User List:", users);

    // 更新用户
    const updatedUser = await database.update(User, { email: "john@example.com" }, { name: "John Updated" });
    console.log("Updated User:", updatedUser);

    // 删除用户
    const deletedUser = await database.delete(User, { email: "john@example.com" });
    console.log("Deleted User:", deletedUser);
}

run();
