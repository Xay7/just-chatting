const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {

            const result = Joi.validate(req.body, schema);
            if (result.error) {

                return res.status(400).json(result.error);
            }

            if (!req.value) { req.value = {}; }

            req.value['body'] = result.value;
            next();
        }
    },
    schemas: {
        signUpSchema: Joi.object().keys({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        signInSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
    }
}