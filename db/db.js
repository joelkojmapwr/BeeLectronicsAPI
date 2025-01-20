// Database connection (update with your database credentials)
const mysql = require("mysql2");

const db = mysql.createConnection({
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

module.exports = db;