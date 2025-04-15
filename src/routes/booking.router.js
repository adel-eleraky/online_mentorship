import express from 'express';
import { authMiddleware, restrictTo } from './../middlewares/auth/authMiddleware.js';
import * as bookingController from './../controllers/booking.controller.js';

const router = express.Router();

router.get(
    "/checkout-session/:sessionId",
    authMiddleware,
    restrictTo("User"),
    bookingController.getCheckoutSession
);



router.get(
    "/checkout-session/one-to-one/:sessionId",
    authMiddleware,
    restrictTo("User"),
    bookingController.getCheckoutOneToOneSession
);

router.get(
    "/",  
    authMiddleware,  
    restrictTo("Admin"),  
    bookingController.getAllBookings
);

// router.post("/webhook" , express.raw({ type: "application/json" }) , bookingController.webhookCheckout)
router.post("/" , authMiddleware , restrictTo("User") , bookingController.createBooking)

export default router ;
