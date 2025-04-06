
import Joi from "joi";
import User from "../../models/user.model.js";
import * as bcrypt from 'bcrypt';
import Mentor from "../../models/mentor.model.js";
import Admin from "../../models/admin.model.js";

const availableRoles = {
    User,
    Mentor,
    Admin
}

export const updateSchema = Joi.object({
    name: Joi.string()
        .optional()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_ ]+$/)
        .messages({
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username cannot exceed 30 characters",
            "string.pattern.base": "Username can only contain letters, numbers, and underscores",
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional()
        // .external(async (value, helpers) => {
        //     if (value != helpers.prefs.context.email) {

        //         const role = helpers.prefs.context.role
        //         const user = await availableRoles[role].findOne({ email: value })

        //         if (user) {
        //             throw new Joi.ValidationError("email is already in use", [
        //                 {
        //                     message: "Email is already exits",
        //                     path: ["email"],
        //                 },
        //             ]);
        //         }
        //     }
        // })
        .messages({
            "string.email": "Please enter a valid email address (e.g., user@example.com)",
        }),
    phone: Joi.string()
        .optional()
        .length(11)
        // .external(async (value, helpers) => {
        //     const {role , email } = helpers.prefs.context

        //     // let loggedUser = await availableRoles[role].findOne({ email: helpers.prefs.context.email })
        //     const users = await availableRoles[role].find()

        //     let loggedUser = users.find(user => user.email == email)
        //     if (value != loggedUser.phone) {

        //         const existPhone = users.find(user => {
        //             return user.phone == value && user.email != email
        //         })
        //         if (existPhone) {
        //             throw new Joi.ValidationError("Phone is already exist", [
        //                 {
        //                     message: "Phone is already exits",
        //                     path: ["phone"],
        //                 },
        //             ]);
        //         }
        //     }
        // })
        .messages({
            "string.length": "Phone number must be 11 characters long",
        }),
    title: Joi.string()
        .optional()
        .min(3)
        .max(30)
        .messages({
            "string.min": "Title must be at least 3 characters long",
            "string.max": "Title cannot exceed 30 characters",
            "string.empty": "Title cannot be empty"
        }),
    about: Joi.string()
        .optional()
        .min(20)
        .max(500)
        .messages({
            "string.min": "About must be at least 20 characters long",
            "string.max": "About cannot exceed 500 characters",
            "string.empty": "About cannot be empty"
        }),
    skills: Joi.array()
        .optional()
        .messages({
            "array.base": "Skills must be an array",
            "string.empty": "Skill cannot be empty"
        }),
});


export const passwordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .external(async (value, helpers) => {
            // check if the old password is correct
            const user = await User.findById(helpers.prefs.context.id);
            if (!bcrypt.compareSync(value, user.password)) {
                throw new Joi.ValidationError("wrong password", [
                    {
                        message: "Old password is incorrect",
                        path: ["oldPassword"]
                    }
                ])
            }
        })
        .messages({
            "any.required": "Old password is required",
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
        .messages({
            "string.min": "Password must be at least 6 characters long",
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
            "any.required": "Password is required",
        }),
    confirmedPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Confirm Password must match Password",
            "any.required": "Confirm password is required",
        }),
})


export const createAdminSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .pattern(/^[a-zA-Z0-9_ ]+$/)
        .messages({
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username cannot exceed 30 characters",
            "string.pattern.base":
                "Username can only contain letters, numbers, and underscores",
            "any.required": "Username is required",
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .external(async (value) => {

            const admin = await Admin.findOne({ email: value })

            if (admin) {
                throw new Joi.ValidationError("email is already in use", [
                    {
                        message: "Email is already exits",
                        path: ["email"],
                    },
                ]);
            }
        })
        .messages({
            "string.email":
                "Please enter a valid email address (e.g., user@example.com)",
            "any.required": "Email is required",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
        )
        .messages({
            "string.min": "Password must be at least 6 characters long",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
            "any.required": "Password is required",
        }),
    confirmedPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Confirm Password must match Password',
            'string.empty': 'Confirm password is required'
        }),
    phone: Joi.string()
        .required()
        .external(async (value) => {

            const admins = await Admin.find()

            const existPhone = admins.find(admin => admin.phone == value)
            if (existPhone) {
                throw new Joi.ValidationError("Phone is already exist", [
                    {
                        message: "Phone is already exits",
                        path: ["phone"],
                    },
                ]);
            }
        })
        .messages({
            "any.required": "Phone number is required",
        }),
})

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync({ ...req.body, ...req.params }, { abortEarly: false, context: req.user });
        next()
    } catch (error) {

        const errors = {};
        for (let err of error.details) {
            errors[err.path[0]] = err.message;
        }
        return res.status(400).json({
            status: "fail",
            message: "validation error",
            errors,
        });
    }
    // if (error) {
    //     // const errors = error.details.map((err) => err.message);
    // }
    // next();
};