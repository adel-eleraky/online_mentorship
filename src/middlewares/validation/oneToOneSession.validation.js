import Joi from "joi";

export const createRequestSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({/*...*/ }),
    description: Joi.string().trim().min(10).max(1000).required().messages({/*...*/ }),
    duration: Joi.number().integer().positive().required().messages({/*...*/ }),
    proposed_date: Joi.date().iso().required().messages({/*...*/ }),
    proposed_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({/*...*/ }),
    has_chat_room_preference: Joi.boolean().optional(),

    requester_name: Joi.string().trim().max(100).optional().messages({
        "string.max": `Name should have a maximum length of {#limit}`,
    }),
    requester_email: Joi.string().trim().email().optional().messages({
        "string.email": `Please provide a valid email address`,
    }),
});

export const validateOneToOneRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({
            status: "fail", message: "Validation Error", errors: errors,
        });
    }
    next();
};