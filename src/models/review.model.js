import mongoose from "mongoose"
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    rating: {
        type: number,
        required: [true, "Rating is required"]
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: [true, "Mentor is required"]
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    }
}, { timestamps: true })

const reviewModel = mongoose.model("Review", reviewSchema)
export default reviewModel;