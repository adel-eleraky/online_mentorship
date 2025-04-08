import Post from "../models/post.model.js"
import Room from "../models/rooms.model.js";

export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find().populate({
            path: "user",
            select: "name image title",
        }).populate({
            path: "reactions",
            populate: { path: "likes.user", select: "name image title" }
        })
            .populate({
                path: "comments",
                select: "comments",
                populate: { path: "comments.user", select: "name image title" }
            })

        return res.status(200).json({
            status: "success",
            message: "Posts fetched successfully",
            data: posts
        })
    } catch (err) {

        res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}

export const createPost = async (req, res) => {
    try {

        const post = await Post.create({ ...req.body, user: req.user.id, user_role: req.user.role })

        return res.status(200).json({
            status: "success",
            message: "Post created successfully",
            data: post
        })
    } catch (err) {

        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}


// user delete his post
export const deletePost = async (req, res) => {
    try {

        const post = await Post.findOne({ _id: req.params.id, user: req.user.id })

        await post.deleteOne()

        return res.status(200).json({
            status: "success",
            message: "Post deleted successfully",
        })
    } catch (err) {

        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}

// get logged-in user post
export const getUserPosts = async (req, res) => {

    try {

        const posts = await Post.find({ user: req.user.id })

        return res.status(200).json({
            status: "success",
            message: "Posts fetched successfully",
            data: posts
        })
    } catch (err) {

        res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}


// get user room 
export const getUserRooms = async (req, res) => {
    try {

        const { id } = req.params
        const rooms = await Room.find({ members: { $in: [req.user.id] } })

        return res.status(200).json({
            status: "success",
            message: "rooms fetched successfully",
            data: rooms
        })
    } catch (err) {

        res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}

// get specific user posts
export const getPostsByUserId = async (req, res) => {

    try {

        const posts = await Post.find({ user: req.params.id })
            .populate({
                path: "user",
                select: "name image title"
            })
            .populate({
                path: "reactions",
                populate: { path: "likes.user", select: "name image title" }
            })
            .populate({
                path: "comments",
                select: "comments",
                populate: { path: "comments.user", select: "name image title" }
            })

        return res.status(200).json({
            status: "success",
            message: "Posts fetched successfully",
            data: posts
        })
    } catch (err) {

        res.status(500).json({
            status: "fail",
            message: "Internal server error",
            error: err.message
        });
    }
}