import Like from "../models/like.model.js"

export const createLike = async (req, res) => {

    try {

        const { id, role } = req.user
        const { post } = req.body

        var newLike;
        const existPost = await Like.findOne({ post })
        if (!existPost) {
            newLike = await Like.create({ post, likes: [ { user: id, role } ] })
        } else {
            newLike = await Like.findOneAndUpdate(
                { post },
                { $push: { likes: {user: id , role }}},
                { new: true }
            )
        }

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

export const getPostLikes = async (req, res) =>{
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