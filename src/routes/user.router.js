import { Router } from 'express'
import * as userService from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth/authMiddleware.js';
// import upload from '../../utils/uploadImage.js';


const userRouter = Router()


userRouter.get('/users', userService.getAllUsers);

userRouter.get('/user', authMiddleware, userService.getUserById); ////

userRouter.get("/users/email/:email", userService.searchByEmail);  // Search for users by email
// userRouter.post("/users/upload", authMiddleware, upload.single("profileImage"), userService.updateUserImage); // Upload profile image

userRouter.put('/user', authMiddleware, userService.updateUser); ////

userRouter.delete('/users', userService.deleteAllUsers);
userRouter.delete('/user/:id', userService.deleteUser);


export default userRouter;








