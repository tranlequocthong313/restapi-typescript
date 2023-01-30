import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    passwordConfirmation: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
});

const reissueTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
});

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required()
});

export { reissueTokenSchema, registerSchema, loginSchema, logoutSchema };
