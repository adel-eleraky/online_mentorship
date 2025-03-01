import express from "express"
// import { sendMessage } from "../controllers/message.controller.js"
// import { sendMsgSchema, validate } from "../middlewares/validation/message.validation.js"
import Message from "../models/message.model.js"

const router = express.Router()

router.get("/" , async (req, res) => {
    const data = await Message.find().populate("sender")
    res.status(200).json({ status: "success", data })
})
// router.post("/create", validate(sendMsgSchema) , sendMessage ) // create message
// router.delete("/:message", deleteMessage) // delete message

export default router