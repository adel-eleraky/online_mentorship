import { Router } from 'express'
import * as userService from '../controllers/user.controller.js'
import {authMiddleware, restrictTo} from '../middlewares/auth/authMiddleware.js';
import { createAdminSchema, passwordSchema, updateSchema, validate } from '../middlewares/validation/user.validation.js';
import uploadPhoto, { resizePhoto } from '../middlewares/upload.js';
import { getPostsByUserId, getUserPosts } from '../controllers/post.controller.js';


const userRouter = Router()

// userRouter.use(authMiddleware); // Protect all routes after this middleware

userRouter.get("/sessions" ,authMiddleware , userService.getUserSessions)

userRouter.get("/posts" ,authMiddleware , getUserPosts) // get logged-in user posts

userRouter.get("/:id/posts" , getPostsByUserId)

userRouter.get("/me" ,authMiddleware , userService.getLoggedInUser); // get current logged-in user

userRouter.put('/upload',authMiddleware, uploadPhoto , resizePhoto , userService.uploadProfileImage); // upload profile image

userRouter.put('/',authMiddleware , validate(updateSchema) ,  userService.updateUser); 

userRouter.put("/update-password",authMiddleware , validate(passwordSchema), userService.updatePassword);

userRouter.get('/',authMiddleware , restrictTo("Admin"), userService.getAllUsers);

userRouter.get('/:id',authMiddleware , restrictTo("Admin"), userService.getUserById); 

userRouter.get("/search/:email",authMiddleware , restrictTo("Admin"), userService.searchByEmail);  // Search for users by email

userRouter.delete('/users',authMiddleware , restrictTo("Admin") , userService.deleteAllUsers);

userRouter.delete('/user/:id',authMiddleware , restrictTo("Admin"), userService.deleteUser);

userRouter.get("/admins" , authMiddleware, restrictTo("Admin") , userService.getAllAdmins)
userRouter.post("/admins" , authMiddleware , restrictTo("superAdmin") , validate(createAdminSchema), userService.createAdmin)
export default userRouter;








