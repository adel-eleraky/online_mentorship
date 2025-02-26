import * as authService from "../controllers/auth.controller.js";
import express from "express";
import {
    registerSchema,
    loginSchema,
    validate,
} from "../middlewares/auth/auth.validation.js";


const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), authService.registerUser);
authRouter.post("/login", validate(loginSchema), authService.loginUser);
authRouter.get("/confirm-email/:token", authService.confirmEmail);

export default authRouter;

