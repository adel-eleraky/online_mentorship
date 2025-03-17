import express from "express";
import * as reviewService from "../controllers/review.controller.js";
const reviewRouter =express.Router()



reviewRouter.get("/", reviewService.getAllReviews);

reviewRouter.get("/mentor/:mentorId", reviewService.getReviewsByMentorId);

reviewRouter.post("/", reviewService.createReview);

reviewRouter.delete("/:id", reviewService.deleteReview);

export default reviewRouter;