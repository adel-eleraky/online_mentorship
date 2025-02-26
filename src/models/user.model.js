import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      // set: (phone) => {
      //   return CryptoJS.AES.encrypt(
      //     phone,
      //     process.env.ENCRYPTION_KEY
      //   ).toString();
      // },
      // get: (phone) => {
      //   const bytes = CryptoJS.AES.decrypt(phone, process.env.ENCRYPTION_KEY);
      //   return bytes.toString(CryptoJS.enc.Utf8);
      // },
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


//token generation
userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: "1h",
  });
  this.token = token;
  return token;
};

export default mongoose.model("User", userSchema);