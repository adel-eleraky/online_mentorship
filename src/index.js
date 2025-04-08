import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import roomRouter from "./routes/room.router.js";
import sessionRouter from "./routes/session.router.js";
import messageRouter from "./routes/message.router.js";
import reviewRouter from "./routes/review.router.js";
import { Server } from "socket.io";
import { saveMsg, getRoomMessages } from "./controllers/message.controller.js";
import authRoutes from "./routes/auth.router.js";
import userRoutes from "./routes/user.router.js";
import { meetingHandler } from "./controllers/meeting.controller.js";
import mentorRoutes from "./routes/mentor.router.js";
import bookingRouter from "./routes/booking.router.js";
import { roomHandler } from "./controllers/room.controller.js";
import http from "http"
import path from "path";
import { fileURLToPath } from "url";
import postRouter from "./routes/post.router.js";
import likeRouter from "./routes/like.router.js";
import commentRouter from "./routes/comment.router.js";
import notificationRouter from "./routes/notification.router.js";
import { webhookCheckout } from "./controllers/booking.controller.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")))

app.post("/api/v1/bookings/webhook", express.raw({ type: "application/json" }), webhookCheckout)


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173", "http://localhost:4200"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/sessions", sessionRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/notifications", notificationRouter)

app.use((err, req, res, next) => {
  return res.status(409).json({
    status: "fail",
    message: err.message,
    error: err
  });
});


const connectedUsers = new Map(); // userId -> socketId


mongoose.connect(process.env.MONGO_URL).then((conn) => {
  console.log("DB connected Successfully");

  const server = http.createServer(app)

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`server listening on port ${port}`);

    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
      },
    });


    io.on("connection", (socket) => {
      // socket.on("join_room", async (id) => {
      //   // get all messages in the room
      //   socket.emit("send_room_messages", await getRoomMessages(id));
      // });
      // console.log("New connection" , socket.id)
      // socket.on("send_message", async (data) => {
      //   // console.log(data)
      //   await saveMsg(data);
      //   io.emit("receive_message", data);
      // });
      // messageHandler(socket)

      // 🔐 Listen for user registration
      socket.on("login", (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      roomHandler(socket, io)
      meetingHandler(socket);


      // // 🧹 Clean up on disconnect
      // socket.on("disconnect", () => {
      //   for (let [userId, sId] of connectedUsers.entries()) {
      //     if (sId === socket.id) {
      //       connectedUsers.delete(userId);
      //       break;
      //     }
      //   }
      //   console.log("Socket disconnected:", socket.id);
      // });
    });



    app.set("io", io);
    app.set("connectedUsers", connectedUsers);
  });
});


