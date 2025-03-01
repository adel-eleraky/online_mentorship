import User from "../models/user.model.js";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Mentor from "../models/mentor.model.js";
import Admin from "../models/admin.model.js";
import { sendConfirmationEmail } from '../utils/sendEmail.js';

const register = async (req, res) => {
  try {
    const { name, email, password, confirmedPassword, phone , role } = req.body;

    if (password !== confirmedPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    let newUser;
    if(role == "user") {
      if (await User.findOne({ email })) {
        return res.status(409).json({ message: "Email already exists" });
      }
      newUser = await User.create({ name, email, password, phone });
    } else if(role == "mentor") {
      if (await Mentor.findOne({ email })) {
        return res.status(409).json({ message: "Email already exists" });
      }
      newUser = await Mentor.create({ name, email, password, phone });
    }

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET)
    const user = await User.create({ name, email, password, phone });

    const confirmationLink = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/confirm-email/${token}`;
    console.log(confirmationLink);

    const emailSent = await sendConfirmationEmail(email, confirmationLink, name);

    const objecUser = newUser.toObject();
    delete objecUser.password;

    return res.status(200).json({
      status: "success",
      message: "Welcome to register",
      data: objecUser,
      token
    });

    // if (!emailSent) {
    //   return res.status(500).json({ message: "Registration Successful but email failed to send" });
    // }

  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user
    if(role == "user") {
      user = await User.findOne({ email })
    } else if(role == "mentor") {
      user = await Mentor.findOne({ email })
    } else if(role == "admin") {
      user = await Admin.findOne({ email })
    }

    if (!user) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    if (!user.confirmEmail) {

      const token = jwt.sign({ email, role }, process.env.JWT_SECRET)
      const confirmationLink = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/confirm-email/${token}`;
      const emailSent = await sendConfirmationEmail(email, confirmationLink, user.name);

      return res.status(403).json({
        status: "fail",
        message: "Please confirm your email",
      });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(422).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role , isLoggedIn: true }, process.env.JWT_SECRET, { expiresIn: '1h' })
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

    let user;
    if (decode.role == "user") {
      user = await User.findOne({ email: decode.email });
    } else if (decode.role == "mentor") {
      user = await Mentor.findOne({ email: decode.email});
    }

    if (!user) {
      console.log("Email not found");
      return res.status(404).json({ message: "Email not found" });
    }


    if (user.confirmEmail) {
      return res.status(400).json({ message: "Email is already verified" })
    }


    user.confirmEmail = true;
    user.save();


    // await User.findByIdAndUpdate(user._id, { rconfirmEmail: true }, { new: true });



    console.log("Email confirmed successfully for user:", user.email);
    res.status(200).json({ message: "Email confirmed successfully" });

  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}


export {
  register, login, confirmEmail
};
