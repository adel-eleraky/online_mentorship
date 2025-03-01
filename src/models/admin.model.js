import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            default: "default.png",
        },
        name: {
            type: String,
            unique: [true, "Name already exist"],
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            unique: [true, "Email already exist"],
            required: [true, "Email is required"],
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
    },
    {
        timestamps: true,
    }
);


adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    } if (this.isModified("phone")) {
        this.phone = await bcrypt.hash(this.phone, 8);
    }
    next();
});



export default mongoose.model("Admin", adminSchema);