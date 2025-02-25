import express from "express"
import { sendMessage, deleteMessage } from "../controllers/message.controller.js"
import { sendMsgSchema, validate } from "../middlewares/validation/message.validation.js"

const router = express.Router()


router.post("/create", validate(sendMsgSchema) , sendMessage ) // create message
router.delete("/:message", deleteMessage) // delete message

export default router