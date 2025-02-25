import Joi from "joi";
import Room from "../../models/rooms.model.js";



export let sendMsgSchema = Joi.object({
    content:
        Joi.string()
            .required()
            .messages({
                "any.required": "Content is required",
                "string.empty": "Content cannot be empty"
            }),

    room:
        Joi.string()
            .required()
            .external(async (value) => {

                const room = await Room.findById(value);
                if (!room) {
                    throw new Joi.ValidationError("Room does not exist", [
                        {
                            message: "Room does not exist",
                            path: ["room"],
                        },
                    ]);
                }
            }).messages({
                "any.required": "Room is required",
                "string.empty": "Room cannot be empty"
            }),

    sender_id:
        Joi.string()
            .required()
            .external(async (value,) => {
                // Check if the sender exists
            })
            .messages({
                "any.required": "Sender is required",
                "string.empty": "Room cannot be empty"
            })
})


export let validate = (schema) => {
    return async (req, res, next) => {
        try {
            // validateAsync to handle both synchronous and asynchronous validations
            await schema.validateAsync({ ...req.body, ...req.params }, { abortEarly: false, context: { user: req.user, room_id: req.params.room } });
            next(); // Validation passed, proceed to the next middleware
        } catch (error) {
            if (error.isJoi) {
                // Joi validation errors
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
        }
    };
}