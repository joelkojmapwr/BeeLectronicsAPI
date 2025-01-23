const express = require("express");
//const bodyParser = require("body-parser");
require("dotenv").config();
const logger = require("./logger/logger.js");

logger.initializeLogger("BeeViceAPI.log");

// Initialize app and middleware
const app = express();
app.use(express.json());

// API Endpoints

//const getRouter = require("./routes/get");
const beeViceRouter = require("./routes/BeeViceRoutes.js");
app.use(beeViceRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
