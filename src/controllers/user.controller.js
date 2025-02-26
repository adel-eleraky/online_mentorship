import express from "express";
import UserModel from "../models/user.model.js"

const router = express.Router();

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0, __v: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.user.id;
    const users = await UserModel.find(id, { password: 0, __v: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err.message });
  }
};

// Delete all users
const deleteAllUsers = async (req, res) => {
  try {
    await UserModel.deleteMany({});
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
    const user = await UserModel.findByIdAndDelete(id);

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
    // const { token } = req.headers;
    // console.log(token, process.env.TOKEN_SECRET_KEY);
    // const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
    // console.log(decode);

    const  {id } = req.user.id;


    const updatedUser = await userModel.findByIdAndUpdate( id, req.body, { new: true });

    // const { email, password, role } = req.body;
  } catch (err) { }
}


// Search for users by email
const searchByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

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

// Upload profile image
const updateUserImage = async (req, res) => {
  try {

    const id = req.user.id;
    console.log('id====================================');
    console.log(id);
    console.log('====================================');

    const user = await UserModel.findById(id);
    console.log('user====================================');
    console.log(user);
    console.log('====================================');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (user.profileImage === req.file.filename) {
      return res.status(400).json({
        success: false,
        message: "You are trying to upload the same image",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { profileImage: req.file.filename },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the profile image",
      error: err.message,
    });
  }
};

export { getAllUsers, getUserById, deleteAllUsers, deleteUser, updateUser, searchByEmail, updateUserImage };