import express from "express"
import { authMiddleware, restrictTo } from "../middlewares/auth/authMiddleware.js"
import { createSession ,getVideoToken} from "../controllers/session.controller.js"
import { createSessionSchema, validate } from "../middlewares/validation/session.validation.js"

const router = express.Router()

router.post("/" ,authMiddleware, restrictTo("mentor") , validate(createSessionSchema), createSession) // create session
router.get("/getVideoToken",getVideoToken)
export default router