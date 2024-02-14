import connectDB from "./config/connectDB.js";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/user.routes.js";
import bodyParser from "body-parser";
import ejs from "ejs";


// Load environment variables
dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views' , './public');



// Connect to the database
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));


app.use("/user", router);


app.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.HOST} on port ${process.env.PORT}`);
}
);




