require("../logger/logger.js");

const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bcrypt = require("bcrypt");

function hashPassword(password) {
  const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)
  return bcrypt.hashSync(password, saltRounds);
}

const verifyPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // true if passwords match, false otherwise
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};

router.post("/newUser", (req, res) => {

  const { userName, password, email, firstName, lastName} = req.body;
  console.log(password);
  const passwordHash = hashPassword(password);
  console.log(passwordHash);
  const sql = "INSERT INTO Users (userName, passwordHash, email, firstName, lastName) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [userName, passwordHash, email, firstName, lastName], (err, result) => {
    console.log("Executed query:", db.format(sql, [userName, passwordHash, email, firstName, lastName]));
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "User Created successfully", userId: result.insertId });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT passwordHash FROM Users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = result[0];
    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login successful", userId: user.userId });
  });
});

router.post("/beevice", (req, res) => {
  const { ownerId, serialNumber } = req.body;
  const sql = "INSERT INTO BeeVice (ownerId, serialNumber) VALUES (?, ?)";
  db.query(sql, [ownerId, serialNumber], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "BeeVice added successfully", beeviceId: result.insertId });
  });
});


router.post("/beehives", (req, res) => {
  const { ownerId, beeViceId, queenColor, breed, location } = req.body;
  var sql;
  var values;
  if (beeViceId != null) {
    sql = "INSERT INTO Hives (ownerId, beeviceId, queenColor, breed, location) VALUES (?, ?, ?, ?, ?)";
    values = [ownerId, beeViceId, queenColor, breed, location];
  } else {
    sql = "INSERT INTO Hives (ownerId, queenColor, breed, location) VALUES (?, ?, ?, ?)";
    values = [ownerId, queenColor, breed, location];
  }
  db.query(sql, [ownerId, beeViceId, queenColor, breed, location], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "BeeHive added successfully", hiveId: result.insertId });
  });
});


router.post("/newCommand", (req, res) => {
  const { beeViceId, commandId } = req.body;
  const params = JSON.stringify(req.body.params);
  const sql = "INSERT INTO queuedCommands (beeViceId, commandId, params) VALUES (?, ?, ?)";
  db.query(sql, [beeViceId, commandId, params], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Command added successfully", commandId: result.insertId });
  });
});

router.post("/inspections", (req, res) => {
  const { hiveId, inspectionDate, inspectionTypeId, notes } = req.body;
  const sql = "INSERT INTO Inspections (hiveId, inspectionDate, inspectionTypeId, notes) VALUES (?, ?, ?, ?)";
  db.query(sql, [hiveId, inspectionDate, inspectionTypeId, notes], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Inspection added successfully", inspectionId: result.insertId });
  });
});

module.exports = router;