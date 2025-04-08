import Like from "../models/like.model.js"
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { notify } from "./notification.controller.js";

export const createLike = async (req, res) => {

    try {

        const { id, role } = req.user
        const { post } = req.body

        var newLike;
        const existPost = await Like.findOne({ post })
        if (!existPost) {
            newLike = await Like.create({ post, likes: [{ user: id, role }] })
        } else {
            newLike = await Like.findOneAndUpdate(
                { post },
                { $push: { likes: { user: id, role } } },
                { new: true }
            )
        }

        const postData = await Post.findById(post).populate("user")
        const userData = await User.findById(id)

        const connectedUsers = req.app.get("connectedUsers")
        const io = req.app.get("io")

        await notify({
            userId: postData.user._id,
            message: `${userData.name} liked your post`,
            type: "like",
            io,
            connectedUsers
        });

        return res.status(200).json({
            status: "success",
            message: "like added successfully",
            data: newLike
        })
    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}

export const getPostLikes = async (req, res) => {
    try {

        const { id: post } = req.params

        const likes = await Like.find({ post }).populate({
            path: "likes.user",
            select: "name image title"
        })

        return res.status(200).json({
            status: "success",
            message: "like fetched successfully",
            data: likes
        })
    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}


export const deleteLike = async (req, res) => {
    try {
        const { id: userId } = req.user
        const { postId } = req.params

        const updatedLike = await Like.findOneAndUpdate(
            { post: postId },
            { $pull: { likes: { user: userId } } },
            { new: true }
        )

        if (!updatedLike) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found or like not exists"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "Like removed successfully",
            data: updatedLike
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        })
    }
}
