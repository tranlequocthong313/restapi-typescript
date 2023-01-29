import Joi from 'joi';

const productSchema = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().min(120).required(),
    price: Joi.number().required(),
    image: Joi.string().required()
});

export default productSchema;
