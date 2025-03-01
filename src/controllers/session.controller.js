import Session from "../models/session.model.js";
import Mentor from "../models/mentor.model.js"

export const createSession = async (req, res) => {
    try {

        const session = await Session.create({...req.body , mentor: req.user.id});
        res.status(201).json({
            status: "success",
            message: "Session created successfully",
            data: session
        });

    }catch(err) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}

export const getMentorSessions = async (req, res) => {
    try {
        // get mentor's sessions
    }catch(err) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}