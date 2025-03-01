import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
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
const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;
