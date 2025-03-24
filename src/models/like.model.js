
import mongoose from "mongoose"

const likesSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "user_role",
        required: true
    },
    user_role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        enum: ["User" , "Mentor"]
    },
    like_type: {
        type: String,
        required: [true , "Like type is required"]
    }
})

const likesModel = mongoose.model("Like" , likesSchema)

export default likesModel