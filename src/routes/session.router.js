import express from "express";
import {
  authMiddleware,
  restrictTo,
} from "../middlewares/auth/authMiddleware.js";
import {
  createSession,
  getVideoToken,
  getMentorSessions,
  getAllSessions,
} from "../controllers/session.controller.js";
import {
  createSessionSchema,
  validate,
} from "../middlewares/validation/session.validation.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  restrictTo("Mentor"),
  validate(createSessionSchema),
  createSession
); // create session
router.get("/getVideoToken", getVideoToken);
router.get("/", authMiddleware , restrictTo("Admin"), getAllSessions);
// router.get("/:mentorId",authMiddleware, restrictTo("mentor"), getMentorSessions)
// get mentor's sessions
router.get("/mentor/:mentorId", getMentorSessions);

export default router;
