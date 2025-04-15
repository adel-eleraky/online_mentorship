import Joi from "joi";


export const createPostSchema = Joi.object({
    content:
        Joi.string()
            .min(1)
            .max(700)
            .required()
            .messages({
                "string.min": "content must be at least 5 characters long",
                "string.max": "content cannot exceed 700 characters",
                "any.required": "Content is required",
                "string.empty": "content can't be empty"
            }),
})


export const createLikeSchema = Joi.object({
    like_type:
        Joi.string()
            .valid("like", "love", "support", "celebrate")
            .required()
            .messages({
                "any.required": "Like is required",
                "string.empty": "Like can't be empty",
                "any.only": "Like Type must one of [like, love, support, celebrate]"
            }),
    post:
        Joi.string()
            .required()
            .messages({
                "any.required": "Post ID is required",
                "string.empty": "Post ID can't be empty"
            })

})

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {

            let errors = {}
            for (let err of error.details) {
                errors[err.path[0]] = err.message;
            }

            return res.status(400).json({
                status: "fail",
                message: "validation errors",
                errors
            })

        }
    }
}