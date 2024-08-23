import Joi from "joi";

const loginSchema = Joi.object({
  userName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default loginSchema;
