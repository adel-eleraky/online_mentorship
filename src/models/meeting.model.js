import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    //   roomId: {
    //     type: String,
    //     required: true,
    //   },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Mentor",
      // required: true,
    },
    peers: [
      {
        peerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          // required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const meetingModel = mongoose.model("Meeting", meetingSchema);
export default meetingModel;
