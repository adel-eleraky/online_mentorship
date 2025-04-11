import { Socket } from "socket.io"
import Message from "../models/message.model.js"



export const  saveMsg = async (data) =>{
    try{ 

        const newMessage = await Message.create(data)

        console.log(newMessage)
        return await newMessage.populate("sender")

    }catch(err) {
        console.log(err)
    }
}

export const getRoomMessages = async (id) => {
    try {

        const messages = await Message.find({room: id})
        return messages
    }catch(err) {
        console.log(err)
    }
}


export const getPrivateContacts = async (req, res) => {
    try {

        const { id } = req.user
        const contacts = await Message.find({ $or: [{ sender: id} , {receiver: id}]}).populate("sender")

        return res.status(200).json({
            status: "success",
            data: contacts
        })
    }catch(err) {
        return res.status(500).json({
            status: "fail",
            error: err.message
        })
    }
}