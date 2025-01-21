const express = require("express");
//const bodyParser = require("body-parser");
require("dotenv").config();
require("./logger/logger.js");

// Initialize app and middleware
const app = express();
app.use(express.json());



// API Endpoints

//const getRouter = require("./routes/get");
const postRouter = require("./routes/post");
const getRouter = require("./routes/get");
const updateRouter = require("./routes/update");
app.use(getRouter);
app.use(postRouter);
app.use(updateRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
