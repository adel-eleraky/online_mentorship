import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found. Please register first." });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "1h" }
    );

    const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

    console.log("📧 Sending reset link to:", user.email);
  
    console.log("🔗 Reset URL:", resetUrl);

    // Send the reset password email
    await sendEmail(user.email, "Password Reset Request", resetUrl, "reset", user.name);

    return res.status(200).json({ message: "Password reset link sent! Check your email." });

  } catch (error) {
    console.error("🔥 Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
