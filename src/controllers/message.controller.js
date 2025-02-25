import Message from "../models/message.model.js"


export const sendMessage = async(req , res) => {
    try{ 

        let {sender_id , room , content} = req.body

        const newMessage = await Message.create({sender_id , room , content})

        return res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: newMessage
        })

    }catch(err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}


export const deleteMessage = async (req, res) => {
    try {

        const message = await Message.findByIdAndDelete(req.params.message)

        return res.status(200).json({
            status: "success",
            message: "Message deleted successfully",
        })

    }catch(err) {
        return res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}