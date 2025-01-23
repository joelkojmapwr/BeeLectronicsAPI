require("../logger/logger.js");

const express = require("express");
const router = express.Router();
const db = require("../db/beeViceUserdb.js");



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