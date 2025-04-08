import express from "express"
import { createLike, getPostLikes,deleteLike  } from "../controllers/like.controller.js"
import { authMiddleware } from "../middlewares/auth/authMiddleware.js"
import { createLikeSchema, validate } from "../middlewares/validation/post.validation.js"

const likeRouter = express.Router()

likeRouter.get("/post/:id" , authMiddleware , getPostLikes)
likeRouter.post("/" , authMiddleware /* , validate(createLikeSchema) */, createLike)
likeRouter.delete("/:postId", authMiddleware, deleteLike)

export default likeRouter