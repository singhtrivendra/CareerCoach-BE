"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not defined");
}
mongoose_1.default.connect(process.env.MONGO_URL);
console.log("Connected to MongoDB");
const userSchema = new mongoose_1.default.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
