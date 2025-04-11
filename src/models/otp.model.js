import mongoose from "mongoose";


const optSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp: {
        type: number,
        required: true
    }
})


const otpModel = mongoose.model("Otp" , optSchema)

export default otpModel