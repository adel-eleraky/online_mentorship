import { Socket } from "socket.io"
import Message from "../models/message.model.js"



export const  saveMsg = async (data) =>{
    try{ 

        const newMessage = await Message.create(data)


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