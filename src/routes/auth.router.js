import * as authService from "../controllers/auth.controller.js";
import express from "express";
import {
    registerSchema,
    loginSchema,
    validate,
} from "../middlewares/auth/auth.validation.js";
import { forgotPassword } from "../controllers/forgotPassword.controller.js";
import { resetPassword } from "../controllers/resetPassword.controller.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), authService.register);
authRouter.post("/login", validate(loginSchema), authService.login);
authRouter.get("/logout" , authService.logout)
authRouter.get("/confirm-email/:token", authService.confirmEmail);
authRouter.get("/me" , authService.getLoggedInUser); // get current logged-in user

// Forgot Password - Request Reset (Step 1)
authRouter.post("/forgot-password", forgotPassword);

// Reset Password - Set New Password (Step 2)
authRouter.post("/reset-password/:token", resetPassword);
export default authRouter;

