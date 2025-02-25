import Room from "../models/rooms.model.js"
import Message from "../models/message.model.js"


export const getRooms = async (req, res) => {
    try {

        const rooms = await Room.find()

        return res.status(200).json({
            status: "success",
            message: "Rooms fetched successfully",
            data: rooms
        })
    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}


export const getRoom = async (req, res) => {
    try {

        const room = await Room.findById(req.params.room) // populate members
        if (!room) {
            return res.status(404).json({
                status: "fail",
                message: "Room not found"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "Room fetched successfully",
            data: room
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}

export const getMessagesByRoom = async (req, res) => {
    try {

        const messages = await Message.find({room: req.params.room})

        return res.status(200).json({
            status: "success",
            message: "Messages fetched successfully",
            data: messages
        })

    }catch(err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}


export const createRoom = async (req, res) => {
    try {
        console.log(req.body)
        let { admin, name } = req.body

        let newRoom = await Room.create({ admin, name })

        return res.status(201).json({
            status: "success",
            message: "Room created successfully",
            data: newRoom
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}

export const addMember = async (req, res) => {
    try {

        let { room: id } = req.params
        let { member } = req.body

        const newRoom = await Room.findByIdAndUpdate(id , { $push: {members: member}} , { new: true})

        return res.status(200).json({
            status: "success",
            message: "Member added successfully",
            data: newRoom
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}

export const deleteMember = async (req, res) => {
    try {

        let {room , member} = req.params
        const newRoom = await Room.findByIdAndUpdate(room , { $pull: {members: member}} , { new: true})

        return res.status(200).json({
            status: "success",
            message: "Member deleted successfully",
            data: newRoom
        })

    }catch(err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}