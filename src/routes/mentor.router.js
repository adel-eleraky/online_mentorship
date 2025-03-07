import { Router } from 'express'
import { getAllMentors, getLoggedInMentor, updateMentor, updateMentorPassword, uploadProfileImage, getMentorById, deleteMentor } from '../controllers/mentor.controller.js'
import {authMiddleware, restrictTo} from '../middlewares/auth/authMiddleware.js';
import uploadPhoto, { resizePhoto } from '../middlewares/upload.js';
import { passwordSchema, updateMentorSchema, validate } from '../middlewares/validation/mentor.validation.js';


const mentorRouter = Router()

mentorRouter.use(authMiddleware); // Protect all routes after this middleware

mentorRouter.get("/me" , getLoggedInMentor); // get current logged-in user

mentorRouter.put('/:id/upload', uploadPhoto , resizePhoto , uploadProfileImage); // upload profile image

mentorRouter.put('/', validate(updateMentorSchema) ,  updateMentor); 

mentorRouter.put("/update-password", validate(passwordSchema), updateMentorPassword);

mentorRouter.get('/', restrictTo("admin"), getAllMentors);

mentorRouter.get('/:id', restrictTo("admin"), getMentorById);

mentorRouter.delete('/user/:id', restrictTo("admin"), deleteMentor);



export default mentorRouter;








