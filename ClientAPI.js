const express = require("express");
//const bodyParser = require("body-parser");
require("dotenv").config();
const logger = require("./logger/logger.js");

logger.initializeLogger("ClientAPI.log");

// Initialize app and middleware
const app = express();
app.use(express.json());



// API Endpoints

//const getRouter = require("./routes/get");
const postRouter = require("./routes/post");
const getRouter = require("./routes/get");
const updateRouter = require("./routes/update");
const commonRouter = require("./routes/common");

app.use(getRouter);
app.use(postRouter);
app.use(updateRouter);
app.use(commonRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
