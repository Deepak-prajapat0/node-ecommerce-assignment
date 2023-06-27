const Joi = require("joi");

const signupValidation = Joi.object().keys({
  name:Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .regex(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)
    .required()
    .email()
    .min(12)
    .messages({
      "string.base": `Only characters are allowed`,
      "string.empty": `Email cannot be an empty `,
      "string.min": `Enter valid email`,
      "any.required": `Email is required `,
      "string.pattern.base": "Enter valid Email",
    }),
  password: Joi.string().min(5).required().messages({
    "string.base": `Enter strong password`,
    "string.empty": `Password cannot be empty`,
    "string.min": `Password should have a minimum length of 6`,
    "any.required": `Password is a required field`,
  }),
});

const loginValidation = Joi.object().keys({
  email: Joi.string()
    .regex(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)
    .required()
    .email()
    .min(12)
    .messages({
      "string.base": `Only characters are allowed`,
      "string.empty": `Email cannot be an empty `,
      "string.min": `Enter valid email`,
      "any.required": `Email is required `,
      "string.pattern.base": "Enter valid Email",
    }),
  password: Joi.string().min(5).required().messages({
    "string.base": `Enter strong password`,
    "string.empty": `Password cannot be empty`,
    "string.min": `Password should have a minimum length of 6`,
    "any.required": `Password is a required field`,
  }),
});


module.exports = { signupValidation,loginValidation };
