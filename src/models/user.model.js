import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "default.png",
    },
    name: {
      type: String,
      unique: [true, "Name must be unique"],
    },
    email: {
      type: String,
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    title: {
      type: String,
    },
    about: {
      type: String,
    },
    skills :{
      type: Array,
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


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  } if (this.isModified("phone")) {
    this.phone = await bcrypt.hash(this.phone, 8);
  }
  next();
});

export default mongoose.model("User", userSchema);