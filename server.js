import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/user.routes.js";
import movierouter from "./routes/movie.routes.js";
import roomrouter from "./routes/room.routes.js";
import bodyParser from "body-parser";
import movieRouter from "./routes/movie.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import planRouter from "./routes/plan.routes.js";
import ejs from "ejs";
import path from "path"; 
import connectDB from "./config/connectDB.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Room from "./models/room.model.js";
import ioo from 'socket.io-client';
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



dotenv.config();



app.set('view engine', 'ejs');
app.set('views' , './public');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the 'index.html' file when the root URL is accessed


// Connect to the database
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/img", express.static("public/images"));
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
));
app.use(express.static("public"));

app.use('/movies', movieRouter);
app.use("/user", router);
app.use("/movie" ,movieRouter )
app.use("/subscription", subscriptionRouter);
app.use("/plan", planRouter);
app.use(cors());

app.use('/room',roomrouter) ; 


// ... (previous code)

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('joinRoom', (roomId) => {
        console.log('Joining room:', roomId);
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
    });

    socket.on('notification', (msg, callback) => {
        // Emit the chat message event
        io.emit('chat message', msg);
        socket.on('testEvent', (data) => {
            console.log('Received testEvent:', data);
        });
        
        
        io.emit('testNotification', {
            type: 'new_message',
            message: 'A new message has been added!',
            data: { content: msg }
        });
        

        if (typeof callback === 'function') {
            callback();
        }
    });

    socket.on('testMessage', (data) => {
        console.log('Received test message:', data);
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// ... (remaining code)

app.post("/addMessage", async (req, res) => {
    try {
      const { roomId, senderId, content } = req.body;
  
      // Validate request parameters
      if (!roomId || !senderId || !content) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
  
      // Save the message to MongoDB
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      room.messages.push({ sender: senderId, content });
      await room.save();
  
      io.emit('connection', { senderId, content });
  
      return res.status(200).json({ message: "Message added successfully" });
    } catch (error) {
      console.error("Error adding message:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/triggerNotification", (req, res) => {
    const notificationData = {
        type: 'new_message',
        message: 'A new message has been added!',
        data: { content: 'Hello from the server!' }
    };

    io.emit('connection', notificationData);
    console.log('Emitted testNotification event from the server');

    res.status(200).json({ message: "Notification triggered successfully" });
});


server.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.HOST} on port ${process.env.PORT}`);
});



export { io }; 
