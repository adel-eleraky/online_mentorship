import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import roomRouter from "./routes/room.router.js";
import messageRouter from "./routes/message.router.js";
import { Server } from "socket.io";
import { saveMsg } from "./controllers/message.controller.js";
import authRoutes from "./routes/auth.router.js";
import userRoutes from "./routes/user.router.js";
import { meetingHandler } from "./controllers/meeting.controller.js";

dotenv.config({ path: ".env" });
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/messages", messageRouter);

app.use((err, req, res, next) => {
  return res.status(409).json({
    status: "fail",
    message: err.message,
  });
});

mongoose.connect("mongodb://127.0.0.1:27017/mentorship").then((conn) => {
  console.log("DB connected Successfully");

  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);

    const io = new Server(server, {
      cors: {
        origin: "*",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      // console.log("New connection" , socket.id)
      socket.on("send_message", async (data) => {
        // console.log(data)
        await saveMsg(data);
        io.emit("receive_message", data);
      });
      meetingHandler(socket);
    });
  });
});
