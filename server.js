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
import setupSocket from "./config/configSocket.js";
import rankRouter from "./routes/rank.routes.js";



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

app.use("/quiz", quizRouter);
app.use("/room", roomrouter);
app.use("/rank", rankRouter);

setupSocket(io);

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


app.get("/test-socket", (req, res) => {
  try {
    // Emit a test event to the client
    io.emit('testNotification', 'Test message from server');

    return res.status(200).json({ message: "Test event sent to WebSocket clients" });
  } catch (error) {
    console.error("Error sending test event:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//path to restur .js client page 
app.get("/", (req, res) => {
  res.render("client");
});

server.listen(process.env.PORT, () => {
  console.log(
    `Server is running ${process.env.HOST} on port ${process.env.PORT}`
  );
});

export { io };