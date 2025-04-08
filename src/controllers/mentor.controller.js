import Mentor from "../models/mentor.model.js";
import * as bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import Session from "../models/session.model.js";

// GET all Mentors
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password -_v");
    res.status(200).json({
      status: "success",
      message: "data fetched successfully",
      data: mentors,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching Mentors",
      error: err.message,
    });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.findById(id, { password: 0, __v: 0 });
    res.status(200).json({ status: "success", data: mentor });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Mentors",
      error: err.message,
    });
  }
};

export const getMentorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user.id });

    return res.status(200).json({
      status: "success",
      message: "sessions fetched successfully",
      data: sessions,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
      error: err.message
    });
  }
};


export const getLoggedInMentorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user.id });

    return res.status(200).json({
      status: "success",
      message: "sessions fetched successfully",
      data: sessions,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
      error: err.message
    });
  }
};

export const deleteMentorSessions = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndDelete(id);
    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "Session not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Session deleted successfully",
      data: session,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};
export const updateMentorSessions = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "Session not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Session deleted successfully",
      data: session,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

// Delete mentor by id
export const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findByIdAndDelete(id);

    if (!mentor) {
      return res.status(404).json({
        status: "fail",
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mentor deleted successfully",
      data: mentor,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "An error occurred while deleting the Mentor",
      error: err.message,
    });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { id } = req.user;
    if (req.body.phone) {
      req.body.phone = CryptoJS.AES.encrypt(
        req.body.phone,
        process.env.ENCRYPTION_KEY
      ).toString();
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      message: "Mentor updated successfully",
      data: updatedMentor,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "An error occurred while updating the Mentor",
      error: err.message,
    });
  }
};

export const getLoggedInMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user.id, { password: 0, __v: 0 });
    res.status(200).json({ status: "success", data: mentor });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching Mentor",
      error: err.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    let { id } = req.user;

    const mentor = await Mentor.findById(id);
    mentor.image = req.file.filename;

    await mentor.save();

    res.status(200).json({
      status: "success",
      message: "Photo uploaded successfully",
      data: mentor,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

export const updateMentorPassword = async (req, res) => {
  try {
    let { id } = req.user;
    let { newPassword } = req.body;

    const password = await bcrypt.hash(newPassword, 8);
    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { password },
      { new: true }
    );

    const objecMentor = mentor.toObject();
    delete objecMentor.password;

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: objecMentor,
    });
  } catch (err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
};


export const searchMentor = async (req, res) => {
  try {

    const { name } = req.body
    
    const mentors = await Mentor.find( { name: { $regex: name, $options: "i" }}).select("name image title")

    return res.status(200).json({
      status: "success",
      message: "fetched mentors successfully",
      data: mentors
    })
    
  }catch(err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
}

export const setAvailability = async (req, res) => {
  try {

    const { availability } = req.body
    const mentor = await Mentor.findByIdAndUpdate(req.user.id , { availability} , { new: true})

    return res.status(200).json({
      status: "success",
      message: "mentor set Availability successfully",
      data: mentor
    })
  }catch(err) {
    return res.status(500).json({ status: "fail", message: err.message });
  }
}