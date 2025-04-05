import Comment from "../models/comment.model.js"

export const createComment = async (req, res) => {

    try {

        const { id, role } = req.user
        const { post, content } = req.body

        var newComment;
        const existPost = await Comment.findOne({ post })
        console.log("post" , existPost)
        if (!existPost) {
            newComment = await Comment.create({ post, comments: [ { user: id, role , content} ] })
        } else {
            newComment = await Comment.findOneAndUpdate(
                { post },
                { $push: { comments: {user: id , role, content }}},
                { new: true }
            )
        }

        return res.status(200).json({
            status: "success",
            message: "like added successfully",
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
