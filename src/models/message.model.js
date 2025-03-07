import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "sender_role",
        required: [true, "Sender is required"]
    },
    sender_role: {
        type: String,
        enum: ["User", "Mentor"],
        required: [true, "Sender role is required"]
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Room is required"]
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    }
}, { timestamps: true })

const messageModel = mongoose.model("Message", messageSchema)

export default messageModel;