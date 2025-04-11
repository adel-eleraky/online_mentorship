import Notification from "../models/notification.model.js";
import { sendNotification } from "../utils/notification.js";

export const notify = async ({ userId, message, type, io, connectedUsers }) => {

    const notification = await Notification.create({
        user: userId,
        message,
        type,
    });

    sendNotification(userId, notification, io, connectedUsers);
};


export const getUserNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({ user: req.user.id })

        return res.status(200).json({
            status: "success",
            data: notifications
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        })
    }
}


export const markNotificationRead = async (req, res) => {
    try {

        const { id } = req.body
        const notification = await Notification.findByIdAndUpdate(id , { isRead: true} , { new: true })

        console.log()
        return res.status(200).json({
            status: "success",
            message: "marked notification as Read",
            data: notification
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        })
    }
}