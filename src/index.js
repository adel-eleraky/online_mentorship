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

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use("/api/v1/reviews",reviewRouter)

app.use((err, req, res, next) => {
  return res.status(409).json({
    status: "fail",
    message: err.message,
    error: err
  });
});

mongoose.connect(process.env.MONGO_URL).then((conn) => {
  console.log("DB connected Successfully");

  const server = http.createServer(app)

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`server listening on port ${port}`);

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
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
      roomHandler(socket, io)
      meetingHandler(socket);
    });
  });
});
