import Session from "../models/session.model.js";
import Mentor from "../models/mentor.model.js";
import { StreamClient } from "@stream-io/node-sdk";

export const createSession = async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, mentor: req.user.id });
    res.status(201).json({
      status: "success",
      message: "Session created successfully",
      data: session,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const getMentorSessions = async (req, res) => {
  try {
    // get mentor's sessions
    const mentorId = req.params.mentorId; // الحصول على معرف المرشد من الطلب

    const sessions = await Session.find({ mentor: mentorId }).populate("mentor", "name email"); // جلب الجلسات مع معلومات المرشد

    res.status(200).json({
      status: "success",
      results: sessions.length,
      data: sessions,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const getVideoToken = async (req, res) => {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;
  const userId = req.query.userId;
  try {
    const streamClient = new StreamClient(apiKey, apiSecret);
    const token = streamClient.createToken(userId);
    res.json({ token });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json({
      status: "success",
      message: "data fetched successfully",
      data: sessions,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching sessions",
      error: err.message,
    });
  }
};
