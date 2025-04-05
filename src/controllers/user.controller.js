import User from "../models/user.model.js"
import * as bcrypt from 'bcrypt';
import Booking from "../models/booking.model.js"
import CryptoJS from "crypto-js"

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findById(id, { password: 0, __v: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err.message });
  }
};

// Delete all users
const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All users deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting all users",
      error: err.message,
    });
  }
};

// Delete user by id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user",
      error: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {

    const { id } = req.user;

    if(req.body.phone) {
      req.body.phone = CryptoJS.AES.encrypt(req.body.phone, process.env.ENCRYPTION_KEY).toString(); 
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: updatedUser
    });
    // const { email, password, role } = req.body;
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: "fail",
      message: "An error occurred while updating the user",
      error: err.message,
    });
  }
}


// Search for users by email
const searchByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user",
      error: err.message,
    });
  }
};

// // Upload profile image
// const updateUserImage = async (req, res) => {
//   try {

//     const id = req.user.id;
//     console.log('id====================================');
//     console.log(id);
//     console.log('====================================');

//     const user = await User.findById(id);
//     console.log('user====================================');
//     console.log(user);
//     console.log('====================================');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     if (user.profileImage === req.file.filename) {
//       return res.status(400).json({
//         success: false,
//         message: "You are trying to upload the same image",
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { profileImage: req.file.filename },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Profile image uploaded successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while uploading the profile image",
//       error: err.message,
//     });
//   }
// };

const getLoggedInUser = async (req, res) => {

  try {
    const user = await User.findById(req.user.id, { password: 0, __v: 0 });
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Error fetching user", error: err.message });
  }
}

const getUserSessions = async (req, res) => {

  try {

    const sessions = await Booking.find({ user: req.user.id, paymentStatus: "paid"}).populate("session").select("session")

    return res.status(200).json({
      status: "success",
      message: "sessions fetched successfully",
      data: sessions
    })

  }catch(err) {

    return res.status(500).json({
      status: "fail",
      message: "internal server error"
    })
  }
}

const uploadProfileImage = async (req, res) => {
  try {

    let { id } = req.user

    const user = await User.findById(id)
    user.image = req.file.filename

    await user.save()

    res.status(200).json({
      status: "success",
      message: "Photo uploaded successfully",
      data: user
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const updatePassword = async (req, res) => {

  try {

    let { id } = req.user
    let { newPassword } = req.body

    const password = await bcrypt.hash(newPassword, 8)
    const user = await User.findByIdAndUpdate(id , {password} , {new: true})

    const objecUser = user.toObject();
    delete objecUser.password;

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: objecUser
    })

  }catch(err) {
    return res.status(500).json({status: "fail", message: err.message })
  }
}

export {
  getAllUsers,
  getUserSessions,
  getUserById,
  deleteAllUsers,
  deleteUser,
  updateUser,
  searchByEmail,
  getLoggedInUser,
  uploadProfileImage,
  updatePassword
};