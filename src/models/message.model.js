import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "sender_role",
        required: [true, "Sender is required"]
    },
    sender_role: {
        type: String,
        enum: ["User", "Mentor", "Admin"],
        required: [true, "Sender role is required"]
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "sender_role"
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    }
}, { timestamps: true })

const messageModel = mongoose.model("Message", messageSchema)

export default messageModel;