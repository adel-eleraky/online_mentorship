import bcrypt from 'bcrypt'; // ✅ fixed import
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user does not exist." });
    }

     // Don't hash here, let Mongoose do it in pre("save"):
       // ✅ Just store the raw new password
      user.password = newPassword;
   //ave so the new password is hashed
        await user.save();


    return res.status(200).json({ message: "✅ Password reset successful! You can log in now." });

  } catch (error) {
    console.error("🔥 Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export { resetPassword };
