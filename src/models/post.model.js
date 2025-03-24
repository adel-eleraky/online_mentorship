
import mongoose from "mongoose"

const postsSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "user_role",
        required: [true , "Post Creator is required"]
    },
    user_role: {
        type: String,
        required: true,
        enum: ["User" , "Mentor"]
    },
    content: {
        type: String,
        required: [true , "Post content is required"]
    }
})

const postModel = mongoose.model("Post" , postsSchema)

export default postModel