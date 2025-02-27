import express from 'express';
import { authMiddleware, restrictTo } from './../middlewares/auth/authMiddleware.js';
import bookingController from './../controllers/booking.controller';

const router = express.Router();

router.get(
    "/checkout-session/:roomId",
    authMiddleware,  
    bookingController.getCheckoutSession
);

router.get(
    "/",  
    authMiddleware,  
    restrictTo("admin", "lead-guide"),  
    bookingController.getAllBookings
);

export { router };
