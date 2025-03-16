import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import {JWT_PASSWORD} from "./config"
import jwt from "jsonwebtoken";
import {
  UserModel,
 } from "./db";


const app = express();
dotenv.config();

app.use(cors(
    { 
        origin:"https://career-coach-fe.vercel.app",
        methods:["POST","GET" , "DELETE"],
        credentials:true
    }
));

// Signup Route
app.post("/api/v1/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        await UserModel.create({ name, email, password: hashedPassword });

        res.json({ message: "User signed up successfully" });
    } catch (e) {
        console.log(e);
        res.status(411).json({
            message: "User already exists or invalid data"
        });
    }
});

// Sign-in Route
app.post("/api/v1/signin", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Find user by username
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            // Compare the entered password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
                res.json({ token });
            }
            else{
                res.status(403).json({ message: "Incorrect Credentials" });
                return ;
            }
        } else {
            res.status(403).json({ message: "Incorrect Credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});