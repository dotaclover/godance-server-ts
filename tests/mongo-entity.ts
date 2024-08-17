import mongoose, { Document, Schema, Model } from "mongoose";
import EntityDatabase from "../src/services/mongo/entity";
import connect from "../src/services/mongo/connect";


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

const userDatabase = new EntityDatabase<IUser>(User);

async function run() {

    await connect();

    // 创建用户
    const newUser = await userDatabase.create({
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
    });
    console.log("Created User:", newUser);

    // 获取单个用户
    const user = await userDatabase.getOne({ email: "john@example.com" });
    console.log("Fetched User:", user);

    // 获取用户列表
    const users = await userDatabase.getList({});
    console.log("User List:", users);

    // 更新用户
    const updatedUser = await userDatabase.update({ email: "john@example.com" }, { name: "John Updated" });
    console.log("Updated User:", updatedUser);

    // 删除用户
    const deletedUser = await userDatabase.delete({ email: "john@example.com" });
    console.log("Deleted User:", deletedUser);
}

run();
