import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';
import CryptoJS from "crypto-js"

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "default.png",
    },
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "Name must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
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
    skills: {
      type: Array,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
  },
  {
    timestamps: true,
  }
);


userSchema.post(/^find/, async function (docs, next) {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => {
      if (doc.phone) {
        const bytes = CryptoJS.AES.decrypt(doc.phone, process.env.ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        doc.phone = decrypted
      }
    });
  } else if (docs && docs.phone) {
    const bytes = CryptoJS.AES.decrypt(docs.phone, process.env.ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    docs.phone = decrypted
  }
});


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  } if (this.isModified("phone")) {
    this.phone = CryptoJS.AES.encrypt(this.phone, process.env.ENCRYPTION_KEY).toString();
  }
  next();
});

export default mongoose.model("User", userSchema);