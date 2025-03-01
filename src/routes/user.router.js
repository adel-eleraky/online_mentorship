import { Router } from 'express'
import * as userService from '../controllers/user.controller.js'
import {authMiddleware, restrictTo} from '../middlewares/auth/authMiddleware.js';
import { passwordSchema, updateSchema, validate } from '../middlewares/validation/user.validation.js';
import uploadPhoto, { resizePhoto } from '../middlewares/upload.js';


const userRouter = Router()

userRouter.use(authMiddleware); // Protect all routes after this middleware

userRouter.get("/me" , userService.getLoggedInUser); // get current logged-in user

userRouter.put('/:id/upload', uploadPhoto , resizePhoto , userService.uploadProfileImage); // upload profile image

userRouter.put('/', validate(updateSchema) ,  userService.updateUser); 

userRouter.put("/update-password", validate(passwordSchema), userService.updatePassword);

userRouter.get('/', restrictTo("admin"), userService.getAllUsers);

userRouter.get('/:id', restrictTo("admin"), userService.getUserById); 

userRouter.get("/search/:email", restrictTo("admin"), userService.searchByEmail);  // Search for users by email

userRouter.delete('/users', restrictTo("admin") , userService.deleteAllUsers);

userRouter.delete('/user/:id', restrictTo("admin"), userService.deleteUser);



export default userRouter;








