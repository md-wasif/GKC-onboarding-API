const Joi = require('@hapi/joi');

//Register validation
const registerValidation = data => {

    const schema = Joi.object({

        firstName: Joi.string()
        .required(),
        lastName: Joi.string()
        .required(),
        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required()
    });

    return schema.validate(data);
};

//Login validation
const loginValidation = data => {

    const schema = Joi.object({

        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required()
    });

    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;