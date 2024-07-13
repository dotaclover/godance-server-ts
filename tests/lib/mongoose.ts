import mongoose from "mongoose";

const catSchema = new mongoose.Schema({
    name: String
});
export default new class {
    async hello() {
        mongoose.connect('mongodb://127.0.0.1:27017/test');
        const Cat = mongoose.model('Cat', catSchema);
        const kitty = new Cat({ name: 'Zildjian' });
        return kitty.save().then(async (res) => {
            const res2 = await Cat.findById(kitty._id);
            return res._id.toHexString() === res2?._id.toHexString();
        });
    }
}