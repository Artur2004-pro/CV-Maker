function validateEnvVars(requiredVars) {
  const missingVars = [];
  const env = {};
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
    env[varName] = process.env[varName];
  }
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }
  return env;
}

module.exports = validateEnvVars;
