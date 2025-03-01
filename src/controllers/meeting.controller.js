// import { authMiddleware } from "../middlewares/auth/authMiddleware.js";

import userModel from "../models/user.model.js";
import meetingModel from "./../models/meeting.model";

export const meetingHandler = (socket) => {
  //   socket.use(authMiddleware);
  // const createMeeting = async ({ userId }) => {
  const createMeeting = async (userId = "67abd6672d57570a8ea4f61e") => {
    try {
      const meeting = await meetingModel.create({
        createdBy: userId,
        peers: [],
      });

      socket.emit("meetingCreated", { meetingId: meeting._id.toString() });
      console.log(`User ${userId} created meeting ${meeting._id}`);
    } catch (error) {
      console.error("Error creating meeting:", error.message);
    }
  };

  const joinMeeting = async ({ meetingId, userId }) => {
    try {
      const meeting = await meetingModel.findById(meetingId);
      if (!meeting) {
        return socket.emit("error", { message: "meeting not found" });
      }
      // const user = await userModel.findById(userId);
      // if (!user) return socket.emit("error", { message: "User not found" });
      if (!meeting.peers.some((peer) => peer.peerId.toString() === userId)) {
        meeting.peers.push({
          peerId: userId,
          // username: user.username,
        });
        await meeting.save();
      }
      console.log(meeting.peers);

      socket.join(meetingId);
      socket.emit("meetingUsers", { meetingId, participants: meeting.peers });
      socket.to(meetingId).emit("userJoined", { userId });

      console.log(`User ${userId} joined meeting ${meetingId}`);
    } catch (error) {
      console.error("Error joining meeting:", error.message);
    }
  };

  const leaveMeeting = async ({ meetingId, userId }) => {
    try {
      const meeting = await meetingModel.findById(meetingId);
      if (!meeting) return;

      meeting.peers = meeting.peers.filter(
        (peer) => peer.user.toString() !== userId
      );
      await meeting.save();

      socket.to(meetingId).emit("userLeft", { userId });

      console.log(`User ${userId} left meeting ${meetingId}`);
    } catch (error) {
      console.error("Error leaving meeting:", error.message);
    }
  };
  //  WebRTC Signaling Events
  socket.on("signal", ({ signal, to }) => {
    socket.to(to).emit("signal", { signal, from: socket.id });
  });

  socket.on("createMeeting", createMeeting);
  socket.on("joinMeeting", joinMeeting);
  socket.on("leaveMeeting", leaveMeeting);

  socket.on("disconnect", async () => {
    console.log("User disconnected");
    // for later want to delete meeting when everybody leave
  });
};
