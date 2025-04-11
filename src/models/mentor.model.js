import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';
import CryptoJS from "crypto-js";
import { availabilitySchema } from "./availabilitySchema.js";

const mentorSchema = new mongoose.Schema(
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
      required: [true, "Password is required"],
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number already exist"],
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
    availability: {
      type: Map,
      of: [availabilitySchema],
      default: {},
    },
    hour_price: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

mentorSchema.post(/^find/, async function (docs, next) {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => {
      if (doc.phone) {
        const bytes = CryptoJS.AES.decrypt(
          doc.phone,
          process.env.ENCRYPTION_KEY
        );
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        doc.phone = decrypted;
      }
    });
  } else if (docs && docs.phone) {
    const bytes = CryptoJS.AES.decrypt(docs.phone, process.env.ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    docs.phone = decrypted;
  }
});

mentorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 8);
  }
  if (this.isModified("phone")) {
    this.phone = CryptoJS.AES.encrypt(
      this.phone,
      process.env.ENCRYPTION_KEY
    ).toString();
  }
  next();
});

export default mongoose.model("Mentor", mentorSchema);
