
import mongoose from "mongoose";

const oneToOneSessionRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Request must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Request must have a description"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Request must specify a duration"],
    },
    proposed_date: {
      type: Date,
      required: [true, "Request must propose a date"],
    },
    proposed_time: {
      type: String,
      required: [true, "Request must propose a time"],
    },
    has_chat_room_preference: {
      type: Boolean,
      default: false,
    },
    mentor: {
      type: mongoose.Schema.ObjectId,
      ref: "Mentor",
      required: [true, "Request must belong to a mentor"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
      default: null,
      validate: {
        validator: function () {

          return this.user != null || (this.requester_email && this.requester_name);
        },
        message: 'Request must be associated with a logged-in user or provide guest name and email.'
      }
    },
    requester_name: {
      type: String,
      trim: true,

      required: [function () { return !this.user; }, 'Guest name is required if not logged in.'],
      maxlength: 100,
    },
    requester_email: {
      type: String,
      trim: true,
      lowercase: true,

      required: [function () { return !this.user; }, 'Guest email is required if not logged in.'],
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "scheduled", "completed", "cancelled"],
      default: "pending",
    },
    mentor_notes: {
      type: String,
      trim: true,
    },

  },
  { timestamps: true }
);


oneToOneSessionRequestSchema.index({ mentor: 1, status: 1 });
oneToOneSessionRequestSchema.index({ user: 1, status: 1 });
oneToOneSessionRequestSchema.index({ requester_email: 1, status: 1 });


oneToOneSessionRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email image',
    options: { omitUndefined: true }
  }).populate({
    path: 'mentor',
    select: 'name email title image'
  });
  next();
});


export default mongoose.model("OneToOneSessionRequest", oneToOneSessionRequestSchema);