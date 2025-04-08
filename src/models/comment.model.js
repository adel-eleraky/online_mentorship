import mongoose from "mongoose"

const commentsSchema = new mongoose.Schema({

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "comments.role",
                required: true
            },
            role: {
                type: String,
                enum: ["User", "Mentor"],
                required: true
            },
            content: {
                type: String,
                required: [true, "comment is required"]
            }
        }
    ],
})

const commentsModel = mongoose.model("Comment", commentsSchema)

export default commentsModel