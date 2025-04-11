import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { notify } from "./notification.controller.js";


export const createComment = async (req, res) => {

    try {

        const { id, role } = req.user
        const { post, content } = req.body

        var newComment;
        const existPost = await Comment.findOne({ post })

        if (!existPost) {
            newComment = await Comment.create({ post, comments: [{ user: id, role, content }] })
        } else {
            newComment = await Comment.findOneAndUpdate(
                { post },
                { $push: { comments: { user: id, role, content } } },
                { new: true }
            )
        }

        const postData = await Post.findById(post).populate("user")
        const userData = await User.findById(id)

        const connectedUsers = req.app.get("connectedUsers")
        const io = req.app.get("io")

        await notify({
            userId: postData.user._id,
            message: `${userData.name} commented on your post: "${content}"`,
            type: "comment",
            io,
            connectedUsers
        });



        return res.status(200).json({
            status: "success",
            message: "comment added successfully",
            data: newComment
        })
    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}
