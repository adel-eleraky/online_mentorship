
import express from "express";
import {
  authMiddleware,
  tryAuthMiddleware,
  restrictTo,
} from "../middlewares/auth/authMiddleware.js";
import {
  createOneToOneRequest,
  getMentorReceivedRequests,
  getUserSentRequests,
  updateRequestStatus
} from "../controllers/oneToOneSession.controller.js";
import {
  createRequestSchema,
  validateOneToOneRequest,
} from "../middlewares/validation/oneToOneSession.validation.js";

const router = express.Router();


router.post(
  "/request",
  tryAuthMiddleware,
  // validateOneToOneRequest(createRequestSchema),
  createOneToOneRequest
);


router.get(
  "/user/requests",
  authMiddleware,
  restrictTo("User"),
  getUserSentRequests
);



router.get(
  "/mentor/requests",
  authMiddleware,
  restrictTo("Mentor"),
  getMentorReceivedRequests
);

router.patch(
  "/request/:requestId/status",
  authMiddleware,
  restrictTo("Mentor"),

  updateRequestStatus
);

export default router;