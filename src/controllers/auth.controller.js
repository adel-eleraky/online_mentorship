import User from "../models/user.model.js";
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import Mentor from "../models/mentor.model.js";
import Admin from "../models/admin.model.js";
import sendResponse from "../utils/sendResponse.js";
import { sendEmail } from "../utils/sendEmail.js";


const availableRoles = {
  User,
  Mentor,
  Admin,
}


const register = async (req, res) => {
  try {
    const { name, email, password, confirmedPassword, phone, role } = req.body;

    if (password !== confirmedPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }


    // const existEmail = await availableRoles[role].findOne({ email })
    // if (existEmail) {
    //   return res.status(409).json({
    //     status: "fail",
    //     errors: {
    //       email: "Email already exist"
    //     }
    //   });
    // }
    // if (await availableRoles[role].findOne({ phone })) {
    //   return res.status(409).json({
    //     status: "fail",
    //     errors: {
    //       phone: "Phone already exist"
    //     }
    //   });
    // }

    // let newUser;
    // if(role == "user") {
    //   if (await User.findOne({ email })) {
    //     return res.status(409).json({ message: "Email already exists" });
    //   }
    //   newUser = await User.create({ name, email, password, phone });
    // } else if(role == "mentor") {
    //   if (await Mentor.findOne({ email })) {
    //     return res.status(409).json({ message: "Email already exists" });
    //   }
    //   newUser = await Mentor.create({ name, email, password, phone });
    // }


    const newUser = await availableRoles[role].create({ name, email, password, phone });

    const token = jwt.sign({ id: newUser._id, email, role }, process.env.JWT_SECRET)
    const confirmationLink = `http://${req.hostname}:5173/confirm-email/${token}`;

    const emailSent = await sendEmail(email, "Confirm Your Account", confirmationLink, "confirm", name);
    const objecUser = newUser.toObject();
    delete objecUser.password;

    return sendResponse(res, 200, {
      message: "Welcome to Mentorship HOME",
      data: objecUser,
      token
    })
    // return res.status(200).json({
    //   status: "success",
    //   message: "Welcome to register",
    //   data: objecUser,
    //   token
    // });

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

    let user = await availableRoles[role].findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Validation Error",
        errors: {
          email: "Email not found",
        },
      });
    }

    // Check if email is confirmed
    if (!user.confirmEmail) {
      const token = jwt.sign({ id: user._id, email, role }, process.env.JWT_SECRET);
      const confirmationLink = `http://${req.hostname}:5173/confirm-email/${token}`;
      const emailSent = await sendEmail(email, "Confirm Your Account", confirmationLink, "confirm", user.name);

      return res.status(403).json({
        status: "fail",
        message: "Please confirm your email",
      });
    }

   // ✅ Use async compare method
   const match = await bcrypt.compare(password, user.password);
   if (!match) {
     return res.status(422).json({
       status: "fail",
       errors: { password: "Incorrect password" }
     });
   }
    // Generate JWT token for a successful login
    const token = jwt.sign({ id: user._id, email, role, isLoggedIn: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const obsecUser = user.toObject();
    delete obsecUser.password;

    obsecUser.role = role;

    return sendResponse(res, 200, {
      message: "Welcome to Mentorship HOME",
      data: obsecUser,
      token,
    });

  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Confirmation link is missing token" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT payload:", decode);

    let user;
    if (decode.role === "User") {
      user = await User.findOne({ email: decode.email });
    } else if (decode.role === "Mentor") {
      user = await Mentor.findOne({ email: decode.email });
    }

    if (!user) {
      console.log("User not found for email:", decode.email);
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.confirmEmail) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    user.confirmEmail = true;
    // Ensure the save operation is awaited
    await user.save();

    console.log("Email confirmed successfully for user:", user.email);
    return res.status(200).json({ message: "Email confirmed successfully" });

  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}


const getLoggedInUser = async (req, res) => {
  try {

    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)

    const user = await availableRoles[decoded.role].findById(decoded.id).select("-password")


    const objecUser = user.toObject();
    objecUser.role = decoded.role

    res.status(200).json({ status: "success", data: objecUser, token: req.cookies.jwt });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Error fetching user", error: err.message });
  }
}



// logout user handler
const logout = async (req, res, next) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  sendResponse(res, 200, {
    status: "success",
    message: "logged out successfully"
  })
}

export {
  register, login, confirmEmail, getLoggedInUser, logout
};
