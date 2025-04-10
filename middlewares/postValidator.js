const Joi  = require('joi');

exports.createPostSchema = Joi.object({
    title: Joi.string()
        .min(10)
        .max(50)
        .required(),
    description: Joi.string()
        .min(10)
        .max(500)
        .required()
        ,
    userId: Joi.string().required()
})