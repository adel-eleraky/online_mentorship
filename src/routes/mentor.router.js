import { Router } from "express";
import {
  getAllMentors,
  getMentorSessions,
  deleteMentorSessions,
  updateMentorSessions,
  getLoggedInMentor,
  updateMentor,
  updateMentorPassword,
  uploadProfileImage,
  getMentorById,
  deleteMentor,
  searchMentor,
} from "../controllers/mentor.controller.js";
import {
  authMiddleware,
  restrictTo,
} from "../middlewares/auth/authMiddleware.js";
import uploadPhoto, { resizePhoto } from "../middlewares/upload.js";
import {
  passwordSchema,
  updateMentorSchema,
  validate,
} from "../middlewares/validation/mentor.validation.js";

const mentorRouter = Router();

// mentorRouter.use(authMiddleware); // Protect all routes after this middleware

mentorRouter.get("/sessions", getMentorSessions);
mentorRouter.delete("/sessions/:id", deleteMentorSessions);
mentorRouter.put("/sessions/:id", updateMentorSessions);

mentorRouter.get("/me", authMiddleware, getLoggedInMentor); // get current logged-in user

mentorRouter.put(
  "/:id/upload",
  authMiddleware,
  uploadPhoto,
  resizePhoto,
  uploadProfileImage
); // upload profile image

mentorRouter.put(
  "/",
  authMiddleware,
  validate(updateMentorSchema),
  updateMentor
);

mentorRouter.put(
  "/update-password",
  authMiddleware,
  validate(passwordSchema),
  updateMentorPassword
);

mentorRouter.post("/search" , searchMentor)
mentorRouter.get("/", authMiddleware , restrictTo("Admin"), getAllMentors);

mentorRouter.get("/:id", getMentorById);

mentorRouter.delete(
  "/user/:id",
  authMiddleware,
  restrictTo("Admin"),
  deleteMentor
);

export default mentorRouter;
