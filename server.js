import connectDB from "./config/connectDB.js";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import invitationRoutes from './routes/invitation.routes.js';
import userRoutes from './routes/user.routes.js';

// Load environment variables
dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 9090;

// Middleware
app.use(express.json()); // Parse le corps de la requête en JSON
app.use(morgan("dev")); // Logger les requêtes HTTP dans la console
app.use(cors()); // Gérer les requêtes CORS

// Routes
app.use('/user', userRoutes);
app.use('/invitation', invitationRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
