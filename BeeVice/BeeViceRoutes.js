require("../logger/logger.js");

const express = require("express");
const router = express.Router();
const db = require("../db/beeViceUserdb.js");


router.put("/queuedCommands/:id/executed", (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE queuedCommands SET executed = 1 WHERE id = ?";
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.query(sql, [id], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
            }
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }
                res.status(200).json({ message: "Command executed successfully" });
            });
        });
    });
});

router.get("/queuedCommands/:beeViceId", (req, res) => {
    const { beeViceId } = req.params;
    const sql = "SELECT * FROM queuedCommands WHERE beeViceId = ?";
    db.query(sql, [beeViceId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

router.post("/sensorReads", (req, res) => {
    const { beeViceId, sensorType, value } = req.body;
    const sql = "INSERT INTO SensorReads (beeViceId, sensorType, value) VALUES (?, ?, ?)";
    db.query(sql, [beeViceId, sensorType, value], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "SensorRead added successfully", sensorReadId: result.insertId });
    });
});

router.post("/beeViceLogs", (req, res) => {
    const { beeViceId, batteryLevel, additionalMessage } = req.body;
    var sql;
    var values;
    if (additionalMessage == null) {
      sql = "INSERT INTO BeeViceLogs (beeViceId, batteryLevel) VALUES (?, ?)";
      values = [beeViceId, batteryLevel];
    }
    else {
      sql = "INSERT INTO BeeViceLogs (beeViceId, batteryLevel, additionalMessage) VALUES (?, ?, ?)";
      values = [beeViceId, batteryLevel, additionalMessage];
    }
    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "BeeViceLog added successfully", beeViceLogId: result.insertId });
    });
  });
  

module.exports = router;