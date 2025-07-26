import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .optional(),

  PORT: Joi.number().default(8000),

  DATABASE_URL: Joi.string().uri()
    .required(),

  JWT_SECRET: Joi.string().required(),

  CORS_ORIGIN: Joi.string().uri()
    .optional(),
});
