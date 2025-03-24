import Joi from "joi";
import User from "../../models/user.model.js";
import Mentor from "../../models/mentor.model.js";
import Admin from "../../models/admin.model.js";
import CryptoJS from "crypto-js";


const availableRoles = {
  User,
  Mentor,
  Admin,
}


const registerSchema = Joi.object({
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
    .external(async (value, helpers) => {
      const role = helpers.prefs.context.fields.role
      const user = await availableRoles[role].findOne({ email: value })

      if (user) {
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
    .external(async (value, helpers) => {
      const role = helpers.prefs.context.fields.role

      const users = await availableRoles[role].find()

      const existPhone = users.find(user => user.phone == value)
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
  role: Joi.string().valid("User", "Mentor").required().messages({
    "any.only": "Role must be either 'user' or 'mentor'",
    "any.required": "Role is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email":
        "Please enter a valid email address (e.g., user@example.com)",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("User", "Mentor", "Admin").required().messages({
    "any.only": "Role must be either 'user' or 'mentor' or 'admin'",
    "any.required": "Role is required",
  }),
});



const validate = (schema) => async (req, res, next) => {

  try {
    await schema.validateAsync({ ...req.body, ...req.params }, { abortEarly: false, context: { fields: req.body } });
    next()
  } catch (error) {

    const errors = {};
    for (let err of error.details) {
      errors[err.path[0]] = err.message;
    }
    return res.status(400).json({
      success: false,
      message: "validation error",
      errors,
    });
  }

};

export { registerSchema, loginSchema, validate };
