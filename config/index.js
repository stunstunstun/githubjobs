const Joi = require('joi')
const path = require('path')

require('dotenv').config({
  path: path.join(path.normalize(__dirname), '.env'),
})

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production'])
    .default('development'),
  PORT: Joi.number().default(3000),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
})
  .unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  mongoUri: envVars.MONGO_URI,
  jwtSecretKey: envVars.JWT_SECRET_KEY,
}

module.exports = config
