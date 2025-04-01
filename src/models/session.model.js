import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "session have a title"],
      unique: [true, "session title already exists"],
    },
    mentor: {
      type: mongoose.Schema.ObjectId,
      ref: "Mentor",
      required: [true, "session must belong to a mentor"],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price"],
    },
    description: {
      type: String,
      required: [true, "session must have a description"],
    },
    duration: {
      type: Number,
      required: [true, "session must have a duration"],
    },
    schedule_time: {
      type: Date,
      required: [true, "session must have a schedule time"],
    },
    status: {
      type: String,
      enum: ["started", "pending", "ended"],
      default: "pending",
    },
    has_room: {
      type: Boolean,
      default: false,
    },
    recordings: [
      {
        session_id: {
          type: String,
        },
        filename: {
          type: String,
        },
        url: {
          type: String,
        },
        start_time: {
          type: String,
        },
        end_time: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
