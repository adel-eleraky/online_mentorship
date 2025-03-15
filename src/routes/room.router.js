import express from 'express';
import { addMember, createRoom, getRooms, getRoom, deleteMember, getMessagesByRoom } from '../controllers/room.controller.js';
import { addMemberSchema, createRoomSchema, deleteMemberSchema, validate } from '../middlewares/validation/room.validation.js';
import { authMiddleware, restrictTo } from '../middlewares/auth/authMiddleware.js';

const router = express.Router();

// router.use(authMiddleware); // Protect all routes after this middleware

router.get("/" , /*restrictTo("admin"),*/ getRooms) // get all room
router.post("/create", restrictTo("mentor"), validate(createRoomSchema) ,  createRoom) // create room
router.get("/:room" , getRoom) // get single room
// router.put("/:room/members" , validate(addMemberSchema) , addMember) // add new member to the room
router.delete("/:room/members/:member", restrictTo("admin" , "mentor"), validate(deleteMemberSchema) , deleteMember) // delete member from the room
router.get("/:room/messages", getMessagesByRoom) // get all messages in a room


export default router