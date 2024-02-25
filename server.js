import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/user.routes.js";
import movierouter from "./routes/movie.routes.js";
import roomrouter from "./routes/room.routes.js";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path"; // Import the 'path' module for constructing paths
import connectDB from "./config/connectDB.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ioo from 'socket.io-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const socket = ioo('ws://localhost:3001');

socket.on('invitation', (data) => {
    console.log('Received invitation:', data);
});

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the 'index.html' file when the root URL is accessed


// Connect to the database
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/user", router);
app.use("/movie", movierouter);
app.use('/room',roomrouter) ; 

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.HOST} on port ${process.env.PORT}`);
});

export { io }; // Export the 'io' instance
