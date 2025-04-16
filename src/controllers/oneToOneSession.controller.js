import OneToOneSessionRequest from "../models/oneToOneSession.model.js";
import Mentor from "../models/mentor.model.js";
import User from "../models/user.model.js";
import { notify } from "./notification.controller.js";
import getNextScheduleTime from "../utils/date.js";

// export const createOneToOneRequest = async (req, res) => {
//     try {
//         const mentorId = req.params.mentorId;
//         const mentor = await Mentor.findById(mentorId);
//         if (!mentor) {
//             return res.status(404).json({ status: "fail", message: "Mentor not found" });
//         }

//         const dataToCreate = {
//             ...req.body,
//             mentor: mentorId,
//         };

//         let loggedInUserId = null;

//         if (req.user && typeof req.user === 'object' && req.user.id) {
//             loggedInUserId = req.user.id;
//         }

//         if (loggedInUserId) {

//             dataToCreate.user = loggedInUserId;

//             delete dataToCreate.requester_name;
//             delete dataToCreate.requester_email;
//         } else {

//             delete dataToCreate.user;

//             if (!dataToCreate.requester_name || !dataToCreate.requester_email) {
//                 console.warn("Attempting to create guest request without name/email in body. Model validation should catch this.");
//             }
//         }

//         const newRequest = await OneToOneSessionRequest.create(dataToCreate);

//         res.status(201).json({
//             status: "success",
//             message: "One-to-one session request submitted successfully.",
//             data: newRequest,
//         });

//     } catch (err) {

//         if (err.name === 'ValidationError') {
//             const errors = Object.values(err.errors).map(el => el.message);
//             const specificMessage = errors.find(msg => msg.includes('logged-in user or provide guest'));
//             const message = specificMessage || `Invalid input data: ${errors.join('. ')}`;
//             console.error("Validation Error:", errors);
//             return res.status(400).json({ status: 'fail', message });
//         }
//         console.error("Error creating session request:", err);
//         res.status(500).json({
//             status: "error",
//             message: "Something went wrong submitting the request.",

//             error: process.env.NODE_ENV === 'development' ? err.message : undefined,
//             stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//         });
//     }
// };

export const createOneToOneRequest = async (req, res) => {
  try {
    const { mentor, user, title, description, requested_time , price} = req.body;

    const schedule_time = getNextScheduleTime(requested_time);
    const newSession = await OneToOneSessionRequest.create({
      title,
      description,
      user,
      mentor,
      requested_time,
      schedule_time,
      price
    });

    const connectedUsers = req.app.get("connectedUsers");
    const io = req.app.get("io");

    const userData = await User.findById(user);

        await notify({
            userId: mentor,
            message: `${userData.name} Request session ${title}`,
            type: "booking",
            io,
            connectedUsers,
        });

        return res.status(200).json({
            status: "success",
            message: "session requested successfully",
            data: newSession,
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const getMentorReceivedRequests = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const requests = await OneToOneSessionRequest.find({ mentor: mentorId })
            .populate("user", "name image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            message: "fetched session requests",
            data: requests,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch requests.",
            error: err.message,
        });
    }
};

export const getUserSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await OneToOneSessionRequest.find({ user: userId })
      .populate("mentor")
      .sort({ createdAt: -1 });
    //   try {
    //     const userId = req.user.id;
    //     const requests = await OneToOneSessionRequest.find({ user: userId })
    //       .populate("mentor", "name image")
    //       .sort({
    //         createdAt: -1,
    //       });

        res.status(200).json({
            status: "success",
            message: "fetched session requests",
            data: requests,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to fetch your requests.",
            error: err.message,
        });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const requestId = req.params.requestId;
        const { status } = req.body;

    const allowedStatusUpdates = [
      "accepted",
      "rejected",
      "completed",
      "pending",
    ];
    if (!allowedStatusUpdates.includes(status)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid status provided." });
    }

        const request = await OneToOneSessionRequest.findOne({
            _id: requestId,
            mentor: mentorId,
        }).populate("mentor");

        if (!request) {
            return res.status(404).json({
                status: "fail",
                message: "Request not found or you are not authorized to update it.",
            });
        }

        request.status = status;
        // if (mentor_notes) {
        //     request.mentor_notes = mentor_notes;
        // }

        await request.save();

        if (status === "accepted" && request.requested_time) {
            await bookMentorAvailabilitySlot(mentorId, request.requested_time);
        }
        
    const connectedUsers = req.app.get("connectedUsers");
    const io = req.app.get("io");

    await notify({
      userId: request.user,
      message: `${request.mentor.name} ${status} your session: ${request.title}`,
      type: "booking",
      io,
      connectedUsers,
    });

        res.status(200).json({
            status: "success",
            message: `Request status updated to ${status}.`,
            data: request,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to update request status.",
            error: err.message,
        });
    }
};


const bookMentorAvailabilitySlot = async (mentorId, requested_time) => {
    try {
        const { day, time } = requested_time;

        const mentor = await Mentor.findById(mentorId);

        if (mentor && mentor.availability?.has(day)) {
            const daySlots = mentor.availability.get(day);
            const slotIndex = daySlots.findIndex(slot => slot.time === time);

            if (slotIndex !== -1) {
                daySlots[slotIndex].status = "booked";
                mentor.availability.set(day, daySlots);
                await mentor.save();
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error("Error updating availability:", error.message);
        throw error;
    }
};