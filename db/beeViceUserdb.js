require("../logger/logger.js");

// Database connection (update with your database credentials)
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_BEEVICE,
  password: process.env.DB_PASSWORD_BEEVICE,
  database: process.env.DB_NAME,
});

function tryToConnect(db) {
  if (db.state === 'connected') {
    return;
  }
  db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      setTimeout(tryToConnect, 2000);
    } else {
      console.log("Connected to the database.");
    }
  });
}
// Connect to the database
tryToConnect(db);

db.on("error", (err) => {
  console.error("Database error:", err.message);
//  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Attempting to reconnect to the database...");
    tryToConnect(db);
  //}
});

module.exports = db;