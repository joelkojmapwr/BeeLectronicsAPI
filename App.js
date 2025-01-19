const express = require("express");
//const bodyParser = require("body-parser");
const mysql = require("mysql2");
require("dotenv").config();

// Initialize app and middleware
const app = express();
app.use(express.json());

// Database connection (update with your database credentials)
/*const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to the database.");
});
*/
// API Endpoints

//const getRouter = require("./routes/get");
const postRouter = require("./routes/post");
const getRouter = require("./routes/get");
app.use(getRouter);
app.use(postRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
