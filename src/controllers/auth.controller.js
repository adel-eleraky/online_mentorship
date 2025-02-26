import userModel from "../models/user.model.js";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config({});
import { sendConfirmationEmail } from '../utils/sendEmail.js';

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, confirmedPassword, phone } = req.body;

    if (password !== confirmedPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }
    if (await userModel.findOne({ email })) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET)
    const user = await userModel.create({ userName: userName, email, password, phone });

    const confirmationLink = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/confirm-email/${token}`;
    console.log(confirmationLink);

    const emailSent = await sendConfirmationEmail(email, confirmationLink, userName);

    const obsecUser = user.toObject();

    delete obsecUser.password;
    res.status(200).json({ message: "Welcome to register", obsecUser, token });

    if (!emailSent) {
      return res.status(500).json({ message: "Registration Successful but email failed to send" });
    }

  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(422).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const obsecUser = user.toObject();
    delete obsecUser.password;
    res.status(200).json({ message: "Welcome to Mentorship HOME", obsecUser, token });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const confirmEmail = async (req, res) => {
  try {
    // const { token } = req.query;
    const { token } = req.params;
    console.log("confirmEmail function triggered with token:", { token });
    if (!token) {
      return res.status(400).json({ message: "Confirmation link is missing token" });
    }

    // verify the token here
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decode);

    const user = await userModel.findOne({ email: decode.email });

    if (!user) {
      console.log("Email not found");
      return res.status(404).json({ message: "Email not found" });
    }


    if (user.confirmEmail) {
      return res.status(400).json({ message: "Email is already verified" })
    }


    user.confirmEmail = true;
    user.save();


    await userModel.findByIdAndUpdate(user._id, { rconfirmEmail: true }, { new: true });



    console.log("Email confirmed successfully for user:", user.email);
    res.status(200).json({ message: "Email confirmed successfully" });

  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}


export {
  registerUser, loginUser, confirmEmail
};
