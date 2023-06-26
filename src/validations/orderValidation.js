const Joi = require("joi")

const orderValidation = Joi.object().keys({
    name: Joi.string()
      .required()
      .min(3)
      .messages({
        "string.base": `Only characters are allowed`,
        "string.empty": `Name cannot be an empty `,
        "string.min": `Enter valid Name`,
        "any.required": `Name is required `,
      }),
      phone: Joi.number()
      .required()
      .min(6000000000)
      .max(9999999999)
      .messages({
        "string.base": `Only numbers are allowed`,
        "string.empty": `Phone cannot be an empty `,
        "string.min": `Enter valid phone`,
        "any.required": `Phone is required `,
      }),
      house: Joi.string()
      .required()
      .min(2)
      .max(15)
      .messages({
        "string.base": `Only characters are allowed`,
        "string.empty": `House cannot be an empty `,
        "string.min": `Enter valid house name or number`,
        "any.required": `House is required `,
      }),
      street: Joi.string()
      .required()
      .min(1)
      .max(15)
      .messages({
        "string.base": `Only characters are allowed`,
        "string.empty": `street cannot be an empty `,
        "string.min": `Enter valid street name or number`,
        "any.required": `Street is required `,
      }),
      city: Joi.string()
      .required()
      .min(4)
      .max(30)
      .messages({
        "string.base": `Only characters are allowed`,
        "string.empty": `City cannot be an empty `,
        "string.min": `Enter valid City name`,
        "any.required": `City is required `,
      }),
      state: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        "string.base": `Only characters are allowed`,
        "string.empty": `State cannot be an empty `,
        "string.min": `Enter valid State name`,
        "any.required": `State is required `,
      }),
      pincode: Joi.number()
      .required()
      .min(111111)
      .max(999999)
      .messages({
        "string.base": `Only numbers are allowed`,
        "string.empty": `Pincode cannot be an empty `,
        "string.min": `Enter valid Pincode`,
        "any.required": `Pincode is required `,
      }),
  });

  module.exports = orderValidation