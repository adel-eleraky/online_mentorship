import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const mentorSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            default: "default.png",
        },
        name: {
            type: String,
            unique: [true , "Name already exist"],
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            unique: [true , "Email already exist"],
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: [true , "Phone number already exist"],
        },
        bio: {
            type: String,
        },
        title: {
            type: String,
        },
        status: {
            type: String,
            default: "inactive",
            enum: ["active", "inactive"],
        },
        experience: {
            type: String,
        },
        confirmEmail: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


mentorSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    } if (this.isModified("phone")) {
        this.phone = await bcrypt.hash(this.phone, 8);
    }
    next();
});


export default mongoose.model("Mentor", mentorSchema);