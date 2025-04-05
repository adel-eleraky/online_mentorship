import express from "express"
import { authMiddleware } from "../middlewares/auth/authMiddleware.js"
import { createComment } from "../controllers/comment.controller.js"

const commentRouter = express.Router()

commentRouter.post("/" , authMiddleware, createComment)

export default commentRouter