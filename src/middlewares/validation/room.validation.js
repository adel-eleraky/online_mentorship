import Joi from "joi";
import Room from "../../models/rooms.model.js";


export let createRoomSchema = Joi.object({
    admin:
        Joi.string()
            .required()
            .external(async (value) => {
                // const admin = await Admin.findById(value);
                // if (!room) {
                //     throw new Joi.ValidationError("Admin does not exist", [
                //         {
                //             message: "Admin does not exist",
                //             path: ["admin"],
                //         },
                //     ]);
                // }
            }).messages({
                "any.required": "Admin is required"
            }),

    name:
        Joi.string()
            .min(2)
            .max(32)
            .required()
            .messages({
                "any.required": "Room name is required",
                "string.min": "Room name must be at least 2 characters",
                "string.max": "Room name must be at most 32 characters"
            })
})

export let addMemberSchema = Joi.object({

    room:
        Joi.string()
            .required()
            .external(async (value) => {
                let room = await Room.findById(value);

                if (!room) {
                    throw new Joi.ValidationError("Room does not exist", [
                        {
                            message: "Room does not exist",
                            path: ["room"],
                        }
                    ])
                }
            }).messages({
                "any.required": "Room is required",
                "string.empty": "Room cannot be empty"
            })
    ,
    member:
        Joi.string()
            .required()
            .external(async (value, helpers) => {
                let { room_id } = helpers.prefs.context;
                let room = await Room.findById(room_id);

                if (room.members.includes(value)) {
                    throw new Joi.ValidationError("Member already exist", [
                        {
                            message: "Member already exist",
                            path: ["member"],
                        }
                    ])
                }
            }).messages({
                "any.required": "Member is required",
                "string.empty": "Member cannot be empty"
            })
})


export let deleteMemberSchema = Joi.object({
    room:
        Joi.string()
            .required()
            .external(async (value) => {
                let room = await Room.findById(value);

                if (!room) {
                    throw new Joi.ValidationError("Room does not exist", [
                        {
                            message: "Room does not exist",
                            path: ["room"]
                        }
                    ])
                }
            }).messages({
                "any.required": "Room is required",
                "string.empty": "Room cannot be empty"
            })
    ,

    member:
        Joi.string()
            .required()
            .external(async (value, helpers) => {
                let { room_id } = helpers.prefs.context;
                let room = await Room.findById(room_id);

                if (!room.members.includes(value)) {
                    throw new Joi.ValidationError("Member doesn't exist on this room", [
                        {
                            message: "Member doesn't exist on this room",
                            path: ["member"],
                        }
                    ])
                }
            }).messages({
                "any.required": "Room is required",
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