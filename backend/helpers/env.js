const dotenv = require("dotenv");
const requiredVars = require("../constants/required-env-vars");
const validateEnvVars = require("./validation-env-vars");

// Load environment variables from .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config();

module.exports = validateEnvVars(requiredVars);
