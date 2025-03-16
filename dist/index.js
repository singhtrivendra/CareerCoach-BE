"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    methods: ["GET", "POST", "PUT", "DELETE"], // List allowed methods
    origin: "*", // Allow requests from any origin
    credentials: true, // Include cookies and credentials in the request
}));
// Signup Route
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10 = salt rounds
        yield db_1.UserModel.create({ name, email, password: hashedPassword });
        res.json({ message: "User signed up successfully" });
    }
    catch (e) {
        console.log(e);
        res.status(411).json({
            message: "User already exists or invalid data"
        });
    }
}));
// Sign-in Route
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        // Find user by username
        const existingUser = yield db_1.UserModel.findOne({ email });
        if (existingUser) {
            // Compare the entered password with the hashed password
            const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
            if (isPasswordValid) {
                const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_PASSWORD);
                res.json({ token });
            }
            else {
                res.status(403).json({ message: "Incorrect Credentials" });
                return;
            }
        }
        else {
            res.status(403).json({ message: "Incorrect Credentials" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
