import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/user.routes.js";
import movierouter from "./routes/movie.routes.js";
import roomrouter from "./routes/room.routes.js";
import User from "./models/user.model.js";
import bodyParser from "body-parser";
import subscriptionRouter from "./routes/subscription.routes.js";
import planRouter from "./routes/plan.routes.js";
import path from "path";
import connectDB from "./config/connectDB.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Room from "./models/room.model.js";
import reclamationRouter from "./routes/reclamation.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import routerTask from "./routes/task.routes.js";
import naughtyWords from "naughty-words";



const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the 'index.html' file when the root URL is accessed

// Load environment variables
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "./public");

// Connect to the database
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/img", express.static("public/images"));
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.static("public"));

app.use("/movies", movierouter);
app.use("/task" , routerTask);
app.use("/user", router);
app.use("/movie", movierouter);
app.use("/subscription", subscriptionRouter);
app.use("/plan", planRouter);
app.use("/reclamation", reclamationRouter);
app.use('/quiz',quizRouter); 
app.use(cors());

app.use("/room", roomrouter);

// ... (previous code)
io.on('connection', (socket) => {
    console.log('connected');

    socket.on('joinRoom', (data, callback) => {
        const { roomId } = data;
        // Leave the current room
        if (socket.roomId) {
            socket.leave(socket.roomId);
            console.log(`A user left room: ${socket.roomId}`);
        }
        // Join the new room
        socket.join(roomId, () => {
            socket.roomId = roomId; // Store the current room ID in socket object
            console.log(`A user joined room: ${roomId}`);
            if (typeof callback === 'function') {
                callback(); // Callback to indicate that room joining is completed
            }
        });
    });
    socket.on('getnotifcationtv', async (userId) => {
        try {
            const notifications = await Notification.find({ recipient: userId }).populate('sender');
            socket.emit('notifications', notifications);
        } catch (error) {
            console.error(error);
        }
    });
    

    socket.on('notification', (msg, callback) => {
        // Emit the chat message event
        io.emit('chat message', msg);
        socket.on('testEvent', (recipient, roomid) => {
            console.log('Received testEvent:', recipient, roomid);
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

    //leave room
    socket.on('leaveRoom', (data, callback) => {
        const { roomId } = data;
        if (socket.roomId) {
            socket.leave(socket.roomId); // Leave the room
            socket.broadcast.to(roomId).emit('leaveRoom');
            console.log(`A user left room: ${socket.roomId}`);
            if (typeof callback === 'function') {
                callback(); // Callback to indicate that room leaving is completed
            }
        }
    });
    socket.on('play', (data) => {
        const { roomId } = data;
      console.log('play event received');
      socket.broadcast.to(roomId).emit('play');

      });
      
      socket.on('pause', (data) => {
        const { roomId } = data;
        console.log('pause event received');
        socket.broadcast.to(roomId).emit('pause');

      });
      socket.on('seek', (data) => {
        const { roomId, seekTo } = data;
        // Broadcast seek event to all other clients except the sender
        socket.broadcast.to(roomId).emit('seek', { seekTo });
      });
      socket.on('seek-backward', (data) => {
        const { roomId, seekTo } = data;
        // Broadcast seek-backward event to all other clients except the sender
        socket.broadcast.to(roomId).emit('seek-backward', { seekTo });
      });

      socket.on('stop', (data) => {
        // Handle the "stop" event here
        // For example, you can broadcast it to all users in the room
        const { roomId } = data;
        socket.broadcast.to(roomId).emit('stop');
    });

   
      

    // Disconnect event
    socket.on('disconnect', () => {
        if (socket.roomId) {
            socket.leave(socket.roomId); // Leave the room on disconnect
            console.log(`A user disconnected from room: ${socket.roomId}`);
        }
        console.log('A user disconnected');
    });
});






app.post("/addMessage", async (req, res) => {

    try {
      let { content } = req.body;
      const { roomId, senderId } = req.body;
  
      if (!roomId || !senderId || !content) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
  
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (naughtyWords.en.includes(content) || naughtyWords.fr.includes(content)) {
        content = "****";
        }
      
  
      const timestamp = new Date(); // Get current timestamp
      const user = await User.findById(senderId); // Fetch user information
      const message = { sender:senderId, content, timestamp, user }; // Include user information in the message
      room.messages.push(message);
      await room.save();
  
      io.to(roomId).emit('chat message', message); // Send message with user information to client
  
      return res.status(200).json({ message: "Message added successfully" });
    } catch (error) {
      console.error("Error adding message:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.use("/quiz", quizRouter);

server.listen(process.env.PORT, () => {
  console.log(
    `Server is running ${process.env.HOST} on port ${process.env.PORT}`
  );
});

export { io };