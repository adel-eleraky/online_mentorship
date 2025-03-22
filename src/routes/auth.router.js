import * as authService from "../controllers/auth.controller.js";
import express from "express";
import {
    registerSchema,
    loginSchema,
    validate,
} from "../middlewares/auth/auth.validation.js";


const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), authService.register);
authRouter.post("/login", validate(loginSchema), authService.login);
authRouter.post("/confirm-email/:token", authService.confirmEmail);
authRouter.get("/me" , authService.getLoggedInUser); // get current logged-in user


export default authRouter;

