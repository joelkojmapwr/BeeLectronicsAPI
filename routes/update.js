require("../logger/logger.js");

const express = require("express");
const router = express.Router();

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

module.exports = router;