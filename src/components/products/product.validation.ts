import Joi from 'joi';

const productSchema = Joi.object({
    title: Joi.string().min(2).required().regex(/[$\(\)<>]/, { invert: true }),
    description: Joi.string().min(50).required().regex(/[$\(\)<>]/, { invert: true }),
    price: Joi.number().required().min(0),
    image: Joi.string().required()
});

export default productSchema;
