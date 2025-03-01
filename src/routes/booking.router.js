import express from 'express';
import { authMiddleware, restrictTo } from './../middlewares/auth/authMiddleware.js';
import * as bookingController from './../controllers/booking.controller.js';

const router = express.Router();

router.get(
    "/checkout-session/:sessionId",
    authMiddleware,
    restrictTo("user"),
    bookingController.getCheckoutSession
);

router.get(
    "/",  
    authMiddleware,  
    restrictTo("admin"),  
    bookingController.getAllBookings
);

router.post("/" , authMiddleware , restrictTo("user") , bookingController.createBooking)

export default router ;
