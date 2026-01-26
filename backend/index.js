const express = require("express");
const cors = require("cors");
const env = require("./helpers/env");
const disconnectServer = require("./helpers/disconnect-server");
const apiRouter = require("./routes/api");
const { connectDB, disconnectDB } = require("./helpers/db");

const app = express();

connectDB();

app.use(cors({credentials: true, origin: true, }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on port http://localhost:${env.PORT}`);
});

process.on("SIGINT", disconnectServer.bind(null, server, disconnectDB));
process.on("SIGTERM", disconnectServer.bind(null, server, disconnectDB));
