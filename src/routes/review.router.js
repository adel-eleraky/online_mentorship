import express from "express";
import * as reviewService from "../controllers/review.controller.js";
import {authMiddleware} from '../middlewares/auth/authMiddleware.js';

const reviewRouter =express.Router()



reviewRouter.get("/", reviewService.getAllReviews);

reviewRouter.get("/mentor/:mentorId", reviewService.getReviewsByMentorId);

reviewRouter.post("/",authMiddleware, reviewService.createReview);

reviewRouter.delete("/:id",authMiddleware, reviewService.deleteReview);

export default reviewRouter;