import Room from "../models/rooms.model.js"
import Message from "../models/message.model.js"
import { saveMsg } from "./message.controller.js"


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
            message: err.message,
            error: err
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
            message: err.message,
            error: err
        })
    }
}

export const getMessagesByRoom = async (req, res) => {
    try {

        const messages = await Message.find({ room: req.params.room }).populate({ path:"sender" , select: "name image"})

        return res.status(200).json({
            status: "success",
            message: "Messages fetched successfully",
            data: messages
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message,
            error: err
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
            message: err.message,
            error: err
        })
    }
}

export const addMember = async (req, res) => {
    try {

        let { room: id } = req.params
        let { member } = req.body

        const newRoom = await Room.findByIdAndUpdate(id, { $push: { members: member } }, { new: true })

        return res.status(200).json({
            status: "success",
            message: "Member added successfully",
            data: newRoom
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message,
            error: err
        })
    }
}

export const deleteMember = async (req, res) => {
    try {

        let { room, member } = req.params
        const newRoom = await Room.findByIdAndUpdate(room, { $pull: { members: member } }, { new: true })

        return res.status(200).json({
            status: "success",
            message: "Member deleted successfully",
            data: newRoom
        })

    } catch (err) {
        return res.status(500).json({
            status: "fail",
            message: err.message,
            error: err
        })
    }
}


export const roomHandler = (socket, io) => {

    const joinRoom = (room) => {
        socket.join(room)
    }

    const sendRoomMsg = async (data) => {
        try {
            const message = await saveMsg(data)

            io.to(data.room).emit("receive_room_msg", message)

        } catch (err) {
            console.log(err)
        }
    }

    socket.on("send_room_msg", sendRoomMsg)
    socket.on("join_room", joinRoom)
}