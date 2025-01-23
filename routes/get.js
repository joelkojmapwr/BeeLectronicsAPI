require("../logger/logger.js");

const express = require("express");
const router = express.Router();
const db = require("../db/db.js");


router.get("/hives", (req, res) => {
  const { ownerId } = req.query;
  const sql = "SELECT * FROM BeeHives WHERE owner_id = ?";
  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

router.get("/hives/:beeViceId/sensorReads", (req, res) => {
  const { beeViceId } = req.params;
  const { startDate, endDate } = req.query;
  let sql = "SELECT * FROM SensorReads WHERE beeViceId = ?";
  const params = [beeViceId];

  if (startDate && endDate) {
    sql += " AND createdAt BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

router.get("/hives/:beeViceId/beeViceLogs", (req, res) => {
  const { beeViceId } = req.params;
  const sql = "SELECT * FROM BeeViceLogs WHERE beeViceId = ?";
  db.query(sql, [beeViceId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

router.get("/sensorTypes", (req, res) => {
  const sql = "SELECT * FROM Sensors";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

/*
// 2. Get all hives
router.get("/hives", (req, res) => {
    const sql = "SELECT * FROM hives";
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  });
  


// 4. Get monitoring data for a hive
router.get("/hives/:id/data", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM hive_data WHERE hive_id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  });
*/

module.exports = router;