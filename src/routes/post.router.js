import express from "express"
import { getAllPosts, createPost, getUserPosts, deletePost } from "../controllers/post.controller.js"
import { createPostSchema, validate } from "../middlewares/validation/post.validation.js"
import { authMiddleware } from "../middlewares/auth/authMiddleware.js"

const postRouter = express.Router()


postRouter.get("/" , getAllPosts)
postRouter.post("/" , authMiddleware , validate(createPostSchema), createPost)
postRouter.delete("/:id" , authMiddleware , deletePost)

export default postRouter