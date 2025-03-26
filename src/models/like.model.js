import mongoose from "mongoose"

const likesSchema = new mongoose.Schema({
    
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "likes.role",
                required: true
            },
            role: {
                type: String,
                enum: ["User", "Mentor"],
                required: true
            }
        }
    ],
})

const likesModel = mongoose.model("Like", likesSchema)

export default likesModel