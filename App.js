const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());

// Database connection (update with your database credentials)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beehive_monitoring",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to the database.");
});

// API Endpoints

// 1. Add a new hive
app.post("/hives", (req, res) => {
  const { name, location } = req.body;
  const sql = "INSERT INTO hives (name, location) VALUES (?, ?)";
  db.query(sql, [name, location], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Hive added successfully", hiveId: result.insertId });
  });
});

// 2. Get all hives
app.get("/hives", (req, res) => {
  const sql = "SELECT * FROM hives";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// 3. Add monitoring data to a hive
app.post("/hives/:id/data", (req, res) => {
  const { id } = req.params;
  const { temperature, humidity, weight } = req.body;
  const sql = "INSERT INTO hive_data (hive_id, temperature, humidity, weight) VALUES (?, ?, ?, ?)";
  db.query(sql, [id, temperature, humidity, weight], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Data added successfully", dataId: result.insertId });
  });
});

// 4. Get monitoring data for a hive
app.get("/hives/:id/data", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM hive_data WHERE hive_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
