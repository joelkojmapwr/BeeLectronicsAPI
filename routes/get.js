const express = require("express");
const { route } = require("./post");
const router = express.Router();


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

module.exports = router;