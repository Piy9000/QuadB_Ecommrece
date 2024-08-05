import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(6).max(50),
  name: Joi.string().required().min(3),
  username: Joi.string().required().min(3).max(30),
  pic: Joi.string().uri().optional(), 
  isAdmin: Joi.boolean().default(false), 
  token: Joi.string().default("")
});
export const searchJoi = Joi.object().keys({
  name: Joi.string().required().min(3),
})
