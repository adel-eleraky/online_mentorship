import express from "express"
import { getAllPosts, createPost, getUserPosts, deletePost, getPostsByUserId, editPost } from "../controllers/post.controller.js"
import { createPostSchema, validate } from "../middlewares/validation/post.validation.js"
import { authMiddleware } from "../middlewares/auth/authMiddleware.js"
import uploadPhoto, { resizePhoto } from "../middlewares/upload.js"

const postRouter = express.Router()


postRouter.get("/" ,authMiddleware , getAllPosts)
postRouter.post("/" , authMiddleware ,  uploadPhoto , resizePhoto , validate(createPostSchema), createPost)
postRouter.delete("/:id" , authMiddleware , deletePost)
postRouter.get("/user/:id" , authMiddleware , getPostsByUserId)
postRouter.put("/edit/:id" , authMiddleware , uploadPhoto , resizePhoto ,editPost)

export default postRouter