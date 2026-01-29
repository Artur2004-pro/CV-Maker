const express = require("express");
const cors = require("cors");
const env = require("./helpers/env");
const disconnectServer = require("./helpers/disconnect-server");
const apiRouter = require("./routes/api");
const { connectDB, disconnectDB } = require("./helpers/db");
const { swaggerUi, specs } = require("./swagger");

const app = express();

connectDB();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "CV Maker API Documentation"
}));

app.use(cors({credentials: true, origin: true, }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on port http://localhost:${env.PORT}`);
  console.log(`API Documentation available at http://localhost:${env.PORT}/api-docs`);
});

process.on("SIGINT", disconnectServer.bind(null, server, disconnectDB));
process.on("SIGTERM", disconnectServer.bind(null, server, disconnectDB));
