import connectDB from "./config/connectDB.js";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import User from "./models/user.model.js";

// Load environment variables
dotenv.config();

const app = express();


// Connect to the database
connectDB();


app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.HOST} on port ${process.env.PORT}`);
}
);




