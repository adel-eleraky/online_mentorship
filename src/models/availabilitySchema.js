import mongoose from "mongoose";


export const availabilitySchema = new mongoose.Schema(
    {
        time: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "booked"],
            default: "available",
        },
    },
    { _id: false }
);