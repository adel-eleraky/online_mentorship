
import Joi from "joi";

export const createSessionSchema = Joi.object({
    title: Joi.string()
        .required()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_ ]+$/)
        .messages({
            "string.min": "title must be at least 3 characters long",
            "string.max": "title cannot exceed 30 characters",
            "string.pattern.base": "title can only contain letters, numbers, and underscores",
            "any.required": "title is required"
        }),
    price: Joi.number()
        .required()
        .messages({
            "any.required": "price is required"
        }),
    description: Joi.string()
        .required()
        .min(20)
        .max(500)
        .messages({
            "string.min": "description must be at least 20 characters long",
            "string.max": "description cannot exceed 500 characters",
            "any.required": "description is required"
        }),
    duration: Joi.number()
        .required()
        .messages({
            "any.required": "duration is required"
        }),
    schedule_time: Joi.date() 
        .required()
        .messages({
            'date.base': 'Schedule time must be a valid date',
            "any.required": "schedule time is required"
        }),
    has_room: Joi.boolean()
        .required()
        .messages({
            "any.required": "Room option is required"
        }),
});

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body , { abortEarly: false, context: req.user });
        next()
    } catch (error) {

        const errors = {};
        for (let err of error.details) {
            errors[err.path[0]] = err.message;
        }
        return res.status(400).json({
            status: "fail",
            message: "Middleware validation error",
            errors,
        });
    }
};