import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.ObjectId,
            ref: "Rooms",
            required: [true, "Booking must be linked to a Room"],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Booking must belong to a User"],
        },
        price: {
            type: Number,
            required: [true, "Booking must have a price"],
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
            lowercase: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate("room").populate("user");
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
