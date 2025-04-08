import express from 'express';
import { authMiddleware } from '../middlewares/auth/authMiddleware.js';
import { getUserNotifications, markNotificationRead } from '../controllers/notification.controller.js';

const router = express.Router();

// router.post("/send", async (req, res) => {
//     const { toUserId, message } = req.body;

//     const notification = await Notification.create({
//         userId: toUserId,
//         message,
//         isRead: false,
//         createdAt: new Date()
//     });

//     sendNotification(toUserId, notification);
//     res.status(200).json({ success: true });
// });

router.get("/" , authMiddleware , getUserNotifications)
router.post("/" , authMiddleware , markNotificationRead)
export default router