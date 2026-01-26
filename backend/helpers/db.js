const mongoose = require("mongoose");
const env = require("../helpers/env");

async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    process.exit(1);
  }
}

module.exports = { connectDB, disconnectDB };
