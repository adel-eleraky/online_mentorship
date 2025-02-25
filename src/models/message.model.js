import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"]
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