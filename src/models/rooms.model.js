import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Room name is required"],
        unique: [true, "Room name already exists"]
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: [true, "Admin is required"]
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    },

}, { timestamps: true })


const roomModel = mongoose.model("Room", roomSchema)

export default roomModel;