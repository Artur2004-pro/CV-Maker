const dotenv = require("dotenv");
const requiredVars = require("../constants/required-env-vars");
const validateEnvVars = require("./validation-env-vars");

dotenv.config({ quiet: true });

module.exports = validateEnvVars(requiredVars);
