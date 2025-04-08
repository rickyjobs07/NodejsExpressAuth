const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string()
        .min(8)
        .max(60)
        .required()
        .email({
            tlds:{ allow: ['com','net']},// Solo permite emails con dominios .com y .net
        }),
        password: Joi.string()
            .required()
            .pattern(new RegExp('(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
            .message({
                "string.pattern.base": "Password must have at least 8 characters, one letter, one number, and one special character.",
            })
});

exports.signinSchema = Joi.object({
    email: Joi.string()
        .min(8)
        .max(60)
        .required()
        .email({
            tlds:{ allow: ['com','net']},// Solo permite emails con dominios .com y .net
        }),
        password: Joi.string()
            .required()
            .pattern(new RegExp('(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
            .message({
                "string.pattern.base": "Password must have at least 8 characters, one letter, one number, and one special character.",
            })
});

exports.acceptCodeSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: {allow: ['com', 'net']}
        }),
    providedCode: Joi.number().required()    
});

exports.changePasswordSchema = Joi.object({
    newPassword: Joi.string()
        .required()
        .pattern(new RegExp('(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
    oldPassword: Joi.string()
    .required()
    .pattern(new RegExp('(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))    
});

exports.forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: {allow: ['com', 'net']}
        }),
    providedCode: Joi.number().required(),
    newPassword: Joi.string()
    .required()
    .pattern(new RegExp('(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))        
});