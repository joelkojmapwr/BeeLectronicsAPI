const express = require("express");
const router = express.Router();


// 1. Add a new hive
router.post("/hives", (req, res) => {
    const { name, location } = req.body;
    const sql = "INSERT INTO hives (name, location) VALUES (?, ?)";
    db.query(sql, [name, location], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Hive added successfully", hiveId: result.insertId });
    });
  });

// 3. Add monitoring data to a hive
router.post("/hives/:id/data", (req, res) => {
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
  
module.exports = router;