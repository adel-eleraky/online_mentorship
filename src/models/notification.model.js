// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: String,
    type: {
        type: String,
        enum: ['comment', 'like', 'booking', 'message'], 
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel