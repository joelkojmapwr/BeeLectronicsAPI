require("../logger/logger.js");

const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.patch("/hives/:id/addBeeVice", (req, res) => {
    const { id } = req.params;
    const { beeViceId } = req.body;
    const sql = "UPDATE Hives SET beeViceId = ? WHERE id = ?";
    db.query(sql, [beeViceId, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "BeeVice added to hive" });
    });
});

router.put("/hives/:id/updateHive", (req, res) => {
    const { id } = req.params;
    const { beeViceId, queenColor, breed, location } = req.body;
    const sql = "UPDATE Hives SET beeViceId = ?, queenColor = ?, breed = ?, location = ? WHERE id = ?";
    db.query(sql, [beeViceId, queenColor, breed, location, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Hive updated successfully with params:" });
    });
});

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

module.exports = router;