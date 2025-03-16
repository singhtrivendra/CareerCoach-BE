import mongoose from "mongoose";

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL environment variable is not defined");
}

mongoose.connect(process.env.MONGO_URL);
console.log("Connected to MongoDB");

const userSchema = new mongoose.Schema({
    name: { type: String }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
});

export const UserModel = mongoose.model('User', userSchema);
